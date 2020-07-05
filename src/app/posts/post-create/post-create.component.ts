import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeTypes} from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;

  mode = 'create';
  private postId: string;
  post: Post;
  imagePreview: string;
  isLoading = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(
        null,
        {
          validators: [Validators.required, Validators.minLength(3)]
        }),
      content: new FormControl(
        null,
        [Validators.required]),
      image: new FormControl(
        null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeTypes]
        })
    });

    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe(
            (postData) => {
              this.post = {
                _id: postData._id,
                title: postData.title,
                content: postData.content
              };
              this.isLoading = false;
              // init form values
              this.form.setValue(
                {title: this.post.title, content: this.post.content}
              );
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      }
    );
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    // image preview reader
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }

    const {title, content} = this.form.value;

    if (this.mode === 'create') {
      this.postService.addPost(title, content);
      this.isLoading = true;
    } else {
      this.postService.updatePost(this.postId, title, content);
    }
  }
}
