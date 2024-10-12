import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-products-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.scss',
})
export class ProductsHomeComponent {}
