import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  templateUrl: './cookbook-list-index.component.html',
  styleUrls: ['./cookbook-list-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookbookListIndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
