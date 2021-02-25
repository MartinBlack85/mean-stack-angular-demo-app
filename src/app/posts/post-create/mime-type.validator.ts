import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

// creating a MIME type validator, will be exported as a function

// this validator function is an async function, the return type for error handling is wrapped in an observable
// the {[key: string]: any} syntax stands for an object with a string type property with any name and any value
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {

    // extracting the file:
    const file = control.value as File;
    // using file reader that can read the value of the file:
    const fileReader = new FileReader();

    // creating a custom observable for the return type, observer controls when the observable emits data and defines the emitted data type
    const fileReaderObservable = Observable.create((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener("loadend", () => {
            // doing the mime type validation, Uint8Array helps to parse the data type structure, not just the name of the file extension
            const uIntArray = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
            // reading a pattern to access the file type, this will build a string of hexa-decimal values of each MIME type
            let header = "";
            let isValid = false;
            for(let i = 0; i < uIntArray.length; i++) {
                header = uIntArray[i].toString(16);
            }
            switch(header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false; // Or you can use the blob.type as fallback
                    break;
        }
        // using the observer to emit data, it will only emit value if it is valid
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
        });
        // function helps to access the mime type
        fileReader.readAsArrayBuffer(file);
    });

    return fileReaderObservable;

};