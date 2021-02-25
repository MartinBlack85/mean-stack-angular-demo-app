import { Component, OnInit, ɵɵtrustConstantResourceUrl } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    
    private mode = 'create';
    private postId: string;
    public post: Post;
    isLoading = false;
    form: FormGroup;
    imagePreview: string;

    constructor(private postsService: PostsService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]}),
            image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                // show spinner while waiting for hettp request result
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    // hide spinner when get http request result
                    this.isLoading = false;
                    this.post = { id: postData._id, title: postData.title, content: postData.content };
                    // prepopulating the form by using the observable subscription:
                    // setvalue override the form controls defined earlier
                    this.form.setValue({
                        title: this.post.title, 
                        content: this.post.content
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onImageUploaded(event: Event) {
        // target refers to the click target, also using type conversion, defines the HTMLInput Element with a files property
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        // this function recalculates the changed value and validation status of this form control
        this.form.get('image').updateValueAndValidity();

        // converting the image into a data url that can be used in a normal image tag
        // need to use the filereader:
        const reader = new FileReader();

        // async function, it uses an inline callback function
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    onSavePost() {
        if(this.form.invalid) {
            return;
        }
        // show spinner while navigating to the post-create route
        this.isLoading = true;
        if(this.mode === 'create') {
            this.postsService.addPost(this.form.value.title, this.form.value.content)
        } else {
            this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
        }
        
        this.form.reset();
    }

}