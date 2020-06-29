import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../post.service';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub: Subscription;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
    this.postsSub = this.postService.postsChanged
      .subscribe(posts => this.posts = posts);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
