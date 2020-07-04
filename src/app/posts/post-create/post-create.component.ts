import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
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
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      }
    );
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
      this.isLoading = true;
    } else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }

  }
}
