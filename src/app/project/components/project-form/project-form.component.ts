import { Component, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { ProjectService } from '../../services/project.service';
import { LinkService } from '../../services/link.service';
import { Link } from '../../models/link';
import { ProjectStore } from '../../store/project.store';
import { ActivatedRoute } from '@angular/router';
import { LinkStore } from '../../store/link.store';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [MatButton, MatDialogModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatIconModule,
    ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})

export class ProjectFormComponent {
  @ViewChild('imgsrc') imgsrc: MatInput | undefined;

  projectForm = this.formBuilder.group({
    id: [0],
    name: [''],
    description: [''],
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

  readonly linkStore = inject(LinkStore);
  readonly store = inject(ProjectStore);
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly announcer = inject(LiveAnnouncer);
  readonly tagsArr = signal<Array<string>>([])
  readonly galleryArr = signal<Array<string>>([])
  readonly linksArr = signal<Array<Link>>([])

  addCount: number = -1;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public projectService: ProjectService, public linkService: LinkService) {


  }
  // Lifecycle
  ngOnInit() {
    this.route.params.subscribe(params => {

      this.linkStore.getLinks()
      if (this.store.projects().length == 0 || this.store.project())
        this.store.getProjectById(Number(params["id"]))
      else
        this.store.filterProjectById(Number(params["id"]))

      console.log(this.store.projects())
      console.log(this.store.project())
    })
  }

  ngAfterViewInit() {
    //populate form
    this.store.project().id ? this.projectForm.controls.id.setValue(this.store.project().id) : undefined;
    this.projectForm.controls.name.setValue(this.store.project().name);
    this.projectForm.controls.description.setValue(this.store.project().description);
    this.projectForm.controls.image.setValue(this.store.project().image);
    this.projectForm.controls.imageUrl.setValue(this.store.project().imageUrl);
    this.store.project().links ? this.projectForm.controls.links.setValue(this.store.project().links) : this.projectForm.controls.links.setValue(new Array<Link>())
    this.linksArr.set(this.store.project().links);
    this.store.project().tags ? this.projectForm.controls.tags.setValue(this.store.project().tags) : this.projectForm.controls.tags.setValue([])
    this.tagsArr.set(this.store.project().tags);
    this.store.project().gallery ? this.projectForm.controls.gallery.setValue(this.store.project().gallery) : this.projectForm.controls.gallery.setValue([])
  }

  onSubmit() {
    console.warn(this.projectForm.value);
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

  //Events - Links
  addLink() {
    console.log(this.linksForm.value)
    if (this.linksForm.value.name || this.linksForm.value.url) {
      let newLink = new Link();
      newLink.id = this.addCount--;
      newLink.name = this.linksForm.value?.name?.toString();
      newLink.url = this.linksForm.value?.url?.toString();
      newLink.projectId = Number(this.projectForm.value?.id);
      // this.linkService.linksToAdd.push(newLink)
      this.linksArr().push(newLink);
      this.projectForm.value.links = this.linksArr();
    }
  }

  removeLink(rmlink: Link) {
    if (rmlink.id) {
      // this.linkService.linksToRemove.push(rmlink.id)
      // if (this.linkService.linksToAdd.includes(rmlink))

      this.linksArr.set(this.linksArr().filter(link => link != rmlink))
      // this.projectForm.value.links = this.linksArr().filter(link => link != rmlink)
      this.projectForm.value.links = this.linksArr();
    }
  }
}
