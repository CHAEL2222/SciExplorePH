import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    HomePage,
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [],
})
export class HomePageModule {}
