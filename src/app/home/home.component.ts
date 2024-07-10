import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, MatCard],
})
export class HomeComponent {}
