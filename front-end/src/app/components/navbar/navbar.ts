import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Angular feature 4: child component of the root App component
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {}
