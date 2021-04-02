import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContextPack,Wordlist } from 'src/app/contextpacks/contextpack';
import { ContextPackCardComponent } from 'src/app/contextpacks/contextpack-card.component';
import { ContextPackListComponent } from 'src/app/contextpacks/contextpack-list.component';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';


@Component({
  selector: 'app-add-wordlists',
  templateUrl: './add-wordlists.component.html',
  styleUrls: ['./add-wordlists.component.scss']
})
export class AddWordlistsComponent implements OnInit  {
    wordlistsForm: FormGroup;
    data = JSON.parse(localStorage.getItem('name'));
    contextpack: ContextPack;
    contextPackList: ContextPackListComponent;
    i: ContextPack[] = [];
    m;
    o: ContextPack[] = [];
    y: ContextPack[] = [];

    contextpackcard = new ContextPackCardComponent(this.contextPackService,this.snackBar,this.router);
    isShown = false;
    inputValue;

    formErrors = {
      wordlists: this.wordlistsErrors()
    };

    validationMessages = {
      wordlists: {
        name: [
          {type: 'required', message: 'Name is required'},
        ],
        enabled: {
          required: 'Must be true or false (check capitalization)',
        },
        nouns: {
          word: {
          },
          forms: {
          },
        },
        adjectives: {
          word: {
          },
          forms: {
          },
        },
        verbs: {
          word: {
          },
          forms: {
          },
        },
        misc: {
          word: {
          },
          forms: {
          },
        }
      }
    };

    constructor(private fb: FormBuilder, private contextPackService: ContextPackService,
      private snackBar: MatSnackBar, private router: Router) { }




    ngOnInit() {
      this.wordlistsForm = this.fb.group({
        wordlists: this.fb.array([])
      });

      this.wordlistsForm.valueChanges.subscribe(data => this.validateForm());
    }

    initwordlist() {
     this.contextPackService.initwordlist(this.fb);
    }

    initNouns() {
      this.contextPackService.initNouns(this.fb);
    }

    addWordlist() {
      const control = this.wordlistsForm.controls.wordlists as FormArray;
      control.push(this.contextPackService.initwordlist(this.fb));
    }
    addPosArray(ix: number, pos: string){
      const control = (this.wordlistsForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray;
      control.push(this.contextPackService.initNouns(this.fb));
    }
    addForms(ix: number, iy: number, pos: string) {
      const control = ((this.wordlistsForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray)
      .at(iy).get('forms') as FormArray;
      control.push(this.fb.control(''));
    }
    setWord(ix: number, iy: number, pos: string){
      const control = (((this.wordlistsForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray).at(iy)
      .get('word'));

      const formAdd = (((this.wordlistsForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray).at(iy)
      .get('forms') as FormArray).at(0).value.toString();
      console.log('didnt go through');
        control.setValue(formAdd);
        console.log(ix,iy);
    }


    removeWordlist(empIndex: number){
      (this.wordlistsForm.controls.wordlists as FormArray).removeAt(empIndex);
    }

    removeWord(ix: number, iy: number, pos: string){
      ((this.wordlistsForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray).removeAt(iy);
    }

    removeForm(ix: number, iy: number, iz: number,  pos: string){
      (((this.wordlistsForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray)
      .at(iy).get('forms') as FormArray).removeAt(iz);
    }

    wordlistsErrors() {
      this.contextPackService.wordlistsErrors(this.fb);

    }

    nounsErrors() {
      this.contextPackService.nounsErrors(this.fb);
    }
    // form validation
    validateForm() {
      this.validateWordlists();
    }
    validateWordlists() {
      const wordlistsA = this.wordlistsForm.controls.wordlists as FormArray;
      // console.log(XsA.value);
      this.contextPackService.validateWordlists(wordlistsA,this.fb,this.formErrors);
    }




//-----------------------------------------------------------------------------submits the form updating the context pack

  submitForm() {
    this.contextPackService.getContextPacks().subscribe(contextpacks => {
      for(this.m = 0;this.m<contextpacks.length;this.m++){
        this.i.push(contextpacks[this.m]);
        if(contextpacks[this.m].name === this.data)// figure out a better if
        {

          this.o.push(contextpacks[this.m]);
          // figure out the more than two context packs situation
        }

      }
      const formArray = this.wordlistsForm.get('wordlists') as FormArray;
      for(this.m=0;this.m<formArray.value.length;this.m++){
        this.o[0].wordlists.push(formArray.value[this.m]);
      }
      this.contextPackService.updateContextPack(this.o[0]).subscribe(contextpack => {
      this.snackBar.open(contextpack.name[0].toUpperCase()+contextpack.name.substring(1,
        contextpack.name.length).toLowerCase()
        + ' Pack is Updated ' , null, {
          duration: 2000,
        });
        this.router.navigate(['/contextpacks/' + this.o[0]._id]);
      }, err => {
        this.snackBar.open('Failed to update the pack', 'OK', {
          duration: 5000,
        });
      });}
 ,);



}

}
