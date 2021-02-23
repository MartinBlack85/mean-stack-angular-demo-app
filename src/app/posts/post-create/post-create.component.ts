import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    
    // onAddPost(postInput: HTMLTextAreaElement) {
    //     this.newPost = postInput.value;
    // }

    constructor(private postsService: PostsService) {}

    onAddPost(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.postsService.addPost(form.value.title, form.value.content)
        form.resetForm();
    }

}