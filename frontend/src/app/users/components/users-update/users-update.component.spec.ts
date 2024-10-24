import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { UsersUpdateComponent } from './users-update.component';
import { UsersService } from '../../services/users.service';

describe('UsersUpdateComponent', () => {
  let component: UsersUpdateComponent;
  let fixture: ComponentFixture<UsersUpdateComponent>;

  // @Component({
  //   imports: [UsersUpdateComponent],
  //   standalone: true,
  //   template: '<app-users-update [userId]="userId" />',
  // })
  // class TestHost {
  //   userId = '123';
  // }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersUpdateComponent],
      providers: [provideHttpClient(), UsersService],
    }).compileComponents();

    // fixture = TestBed.createComponent(TestHost);
    fixture = TestBed.createComponent(UsersUpdateComponent);

    fixture.componentRef.setInput('userId', '123');

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
