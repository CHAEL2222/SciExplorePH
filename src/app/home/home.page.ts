import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DestroyRef, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { ChatConnectionService } from '../shared/services/chat-connection.service';
import { LessonsService } from '../shared/services/lessons.service';
import { Lesson } from '../shared/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  ls = inject(LessonsService);
  private router = inject(Router);
  private chat = inject(ChatConnectionService);
  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  @ViewChild('lessonDialog') lessonDialog?: ElementRef<HTMLDialogElement>;
  @ViewChild('conversation') conversation?: ElementRef<HTMLElement>;
  view = 'dashboard';
  subject = 'All';
  search = '';
  selected = signal<Lesson | null>(null);
  answer = signal<number | null>(null);
  chatOpen = signal(false);
  draft = '';
  lessonContext = '';
  busy = signal(false);
  liveAI = signal(false);
  messages = signal<{ role: 'user' | 'assistant'; text: string }[]>([]);
  lessons: Lesson[];
  completedCount = computed(() => this.ls.completed().length);
  suggestions = [
    'What is Amihan?',
    'Help me with fractions',
    'How do mangroves help us?',
  ];
  constructor() {
    const ls = this.ls;
    const route = inject(ActivatedRoute);

    this.lessons = ls.getAll();
    route.data.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.view = data['view'] || 'dashboard';
    });
    void this.chat.available().then((available) => this.liveAI.set(available));
    if (Capacitor.getPlatform() === 'android') {
      const listener = App.addListener('backButton', () =>
        this.zone.run(() => {
          if (this.selected()) this.selected.set(null);
          else if (this.chatOpen()) this.chatOpen.set(false);
          else if (this.view !== 'dashboard') void this.router.navigate(['/']);
          else void App.exitApp();
        }),
      );
      this.destroyRef.onDestroy(() => {
        void listener.then((handle) => handle.remove());
      });
    }
  }
  get filtered() {
    return this.lessons.filter(
      (l) =>
        (this.subject === 'All' || l.subject === this.subject) &&
        `${l.title} ${l.description} ${l.subject}`
          .toLowerCase()
          .includes(this.search.toLowerCase().trim()),
    );
  }
  get nextLesson() {
    return (
      this.lessons.find((l) => !this.ls.completed().includes(l.id)) ||
      this.lessons[0]
    );
  }
  open(lesson: Lesson) {
    this.selected.set(lesson);
    this.answer.set(null);
    setTimeout(() => this.lessonDialog?.nativeElement.showModal());
  }
  askAboutLesson() {
    this.lessonContext = this.selected()?.content || '';
    this.selected.set(null);
    this.chatOpen.set(true);
  }
  startLearning() {
    this.open(this.nextLesson);
  }
  async send(prompt = this.draft) {
    const text = prompt.trim().slice(0, 1500);
    if (!text || this.busy()) return;
    this.messages.update((items) => [
      ...items.slice(-18),
      { role: 'user', text },
    ]);
    this.draft = '';
    this.busy.set(true);
    this.scrollChat();
    try {
      let reply: string;
      if (this.liveAI()) {
        reply = await this.chat.send({
          messages: this.messages().slice(-12),
          lesson: this.lessonContext,
        });
      } else {
        const terms = text.toLowerCase().match(/[a-z]{4,}/g) || [];
        const ranked = this.lessons
          .map((lesson) => ({
            lesson,
            score: terms.filter((term) =>
              `${lesson.title} ${lesson.description} ${lesson.content}`
                .toLowerCase()
                .includes(term),
            ).length,
          }))
          .sort((a, b) => b.score - a.score);
        const match = ranked[0]?.score ? ranked[0].lesson : null;
        reply = match
          ? `From “${match.title}”:\n\n${match.content}\n\nOpen this lesson to check your understanding with a quick quiz.`
          : 'I’m the offline lesson guide. Try asking about weather, farming, mangroves, energy, fractions, or volcanoes. Live AI needs a server connection configured by the app owner.';
      }
      this.messages.update((items) => [
        ...items,
        { role: 'assistant', text: reply },
      ]);
    } catch {
      this.messages.update((items) => [
        ...items,
        {
          role: 'assistant',
          text: 'The AI connection is unavailable right now. Please try again, or switch to the offline lesson guide.',
        },
      ]);
    } finally {
      this.busy.set(false);
      this.scrollChat();
    }
  }
  useOffline() {
    this.liveAI.set(false);
  }
  clearChat() {
    if (!this.busy()) this.messages.set([]);
  }
  private scrollChat() {
    setTimeout(() => {
      const el = this.conversation?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
