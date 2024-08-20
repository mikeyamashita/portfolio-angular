import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNewUpdateComponent } from './project-new-update.component';

describe('ProjectNewUpdateComponent', () => {
  let component: ProjectNewUpdateComponent;
  let fixture: ComponentFixture<ProjectNewUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectNewUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectNewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
