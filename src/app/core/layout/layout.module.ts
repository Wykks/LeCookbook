import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [LayoutComponent, MenuItemComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
