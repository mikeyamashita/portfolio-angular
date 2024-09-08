import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ProjectService } from '../../services/project.service';
import { ProjectStore } from '../../store/project.store';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { AuthService } from '../../../auth/services/auth.service';
import { LinkStore } from '../../store/link.store';
import { Link } from '../../models/link';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { GridService } from '../../../grid/grid.service/grid.service';

@Component({
  selector: 'app-project-new-update',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, MatIconModule,
    MatCardModule, MatDialogModule,
    RouterModule, MatChipsModule,
    MatProgressSpinnerModule, ReactiveFormsModule,
    ProjectFormComponent,
    MatInputModule, MatFormFieldModule, MatDatepickerModule],
  templateUrl: './project-new-update.component.html',
  styleUrl: './project-new-update.component.scss'
})
export class ProjectNewUpdateComponent {
  projectForm = this.formBuilder.group({
    id: [0],
    name: [''],
    description: [''],
    startDate: [new Date],
    endDate: [new Date],
    image: [''],
    imageUrl: [''],
    links: [new Array<Link>],
    tags: [new Array<string>],
    gallery: [new Array<string>],
  });

  galleryForm = this.formBuilder.group({
    imgsrc: ['']
  });

  linksForm = this.formBuilder.group({
    name: [''],
    url: ['']
  });

  readonly store = inject(ProjectStore);
  readonly linkStore = inject(LinkStore);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly announcer = inject(LiveAnnouncer);
  readonly dialog = inject(MatDialog);

  projectId: string = '-1';
  addCount: number = -1;

  readonly tagsArr = signal<Array<string>>([])
  readonly galleryArr = signal<Array<string>>([])
  readonly linksArr = signal<Array<any>>([])

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public location: Location,
    public projectService: ProjectService,
    public authService: AuthService,
    private gridService: GridService) {
  }

  // Lifecycle
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
      console.log(this.projectId)
      console.log(this.projectService.project());

      this.setControls();

      if (this.projectId == 'new') {
        console.log('new')
      } else {
        this.store.getLinksByProjectId(Number(this.projectId))
        if (this.projectService.project().length == 0)
          this.router.navigateByUrl('/project/' + this.projectId);
        else
          this.store.filterProjectById(Number(this.projectId));
      }
    })
  }

  difference(arr1: Array<Link>, arr2: Array<Link>) {
    return arr1.filter(obj1 => !arr2.some(obj2 => obj1.id === obj2.id));
  }

  setControls() {
    if (this.projectId == "new") {
      this.projectForm.controls.id.setValue(null);
      this.projectForm.controls.image.setValue('');
      this.projectForm.controls.imageUrl.setValue('');
      this.projectForm.controls.name.setValue('');
      this.projectForm.controls.startDate.setValue(new Date);
      this.projectForm.controls.endDate.setValue(new Date);
      this.projectForm.controls.description.setValue('');
      this.projectForm.controls.links.setValue([]);
      this.projectForm.controls.tags.setValue([]);
      this.projectForm.controls.gallery.setValue([]);
    } else {
      this.store.project().id ? this.projectForm.controls.id.setValue(this.store.project().id) : undefined;
      this.projectForm.controls.image.setValue(this.store.project().image);
      this.projectForm.controls.imageUrl.setValue(this.store.project().imageUrl);
      this.projectForm.controls.name.setValue(this.store.project().name);
      this.projectForm.controls.startDate.setValue(this.store.project().startDate);
      this.projectForm.controls.endDate.setValue(this.store.project().endDate);
      this.projectForm.controls.description.setValue(this.store.project().description);
      this.store.project().links ? this.projectForm.controls.links.setValue(this.store.project().links) : this.projectForm.controls.links.setValue(new Array<Link>())
      this.linksArr.set(this.store.project().links);
      this.store.project().tags ? this.projectForm.controls.tags.setValue(this.store.project().tags) : this.projectForm.controls.tags.setValue([])
      this.tagsArr.set(this.store.project().tags);
      this.store.project().gallery ? this.projectForm.controls.gallery.setValue(this.store.project().gallery) : this.projectForm.controls.gallery.setValue([])
    }
  }
  // Events
  onSubmit() {
    // console.warn(this.projectForm.value);
  }

  //Events - Links
  addLink() {
    if (this.linksForm.value.name || this.linksForm.value.url) {
      let newLink = { "id": this.addCount--, "name": this.linksForm.value.name, "url": this.linksForm.value.url, "projectId": Number(this.projectForm.value?.id) }
      this.linksArr().push(newLink);

      this.projectForm.value.links = this.linksArr();
    }
  }

  removeLink(rmlink: Link) {
    if (rmlink.id) {
      this.linksArr.set(this.linksArr().filter(link => link != rmlink))
      this.projectForm.value.links = this.linksArr();
    }
  }

  //Events - Tags
  add(event: MatChipInputEvent): void {
    const tag = (event.value || '').trim();

    if (tag) {
      this.tagsArr.update(tags => [...tags, tag])
      this.projectForm.patchValue({ tags: this.tagsArr() })
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    this.tagsArr.update(tags => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      return [...tags];
    });
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag
    this.tagsArr.update(tags => {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        tags[index] = value;
        return [...tags];
      }
      return tags;
    });
  }

  //Events - Gallery
  addImage() {
    console.log(this.galleryForm.value.imgsrc)
    if (this.galleryForm.value.imgsrc)
      this.projectForm.value.gallery?.push(this.galleryForm.value.imgsrc)
  }

  removeImage(photoUrl: string) {
    console.log(photoUrl)
    this.projectForm.value.gallery = this.projectForm.value.gallery?.filter(img => img != photoUrl)
  }

  // Save
  saveProject() {
    const linksToAdd: Array<Link> = this.difference(this.linksArr(), this.store.links())
    const linksToRemove: Array<Link> = this.difference(this.store.links(), this.linksArr())

    // const symmetricDifference = [...linksToAdd.concat(linksToRemove)];

    console.log('project form:', this.projectForm.value)

    if (this.projectId == 'new') {
      console.log('save new')

      this.projectForm.value.id = undefined
      // linksToAdd.forEach((link: Link) => {
      //   this.projectForm.value.links?.push(link)
      // })

      this.store.addProject(this.projectForm.value)
    } else {
      console.log('project links from form:', this.linksArr())
      console.log('project links from store:', this.store.links())
      console.log('linksToAdd:', linksToAdd)
      console.log('linksToRemove:', linksToRemove)
      // console.log('symmetric difference:', symmetricDifference)

      linksToAdd.forEach((link: Link) => {
        if (link.id)
          if (link.id < 0)
            this.linkStore.addLink(link)
      })

      linksToRemove.forEach((link: Link) => {
        if (link.id)
          this.linkStore.deleteLink(link.id)
      })
      this.store.saveProject(this.projectForm.value)
    }
    this.projectService.project.set(this.projectForm.value)

  }

  cancelChanges() {
    this.router.navigateByUrl('/project/' + this.projectId);
  }

  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(confirm => {
      console.log(confirm)
      if (confirm) {
        //delete associated links before deleting project
        if (this.linksArr().length > 0) {
          this.linksArr().forEach((link: any) => {
            this.linkStore.deleteLink(link.id);
          })
        }
        this.store.deleteProject(Number(this.projectId))
      }
      this.router.navigateByUrl('/grid/' + this.gridService.sorttype());
    });
  }

  navigateToGrid() {
    if (this.projectId == 'new')
      this.router.navigateByUrl('/grid/' + this.gridService.sorttype());
    else
      this.router.navigateByUrl('/project/' + this.projectId);
  }
}
