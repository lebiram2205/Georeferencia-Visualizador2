import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  corazonada() {
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
    
      $("#wrapper").toggleClass("toggled");
    });}

}
