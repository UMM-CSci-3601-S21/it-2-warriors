import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContextPack, Wordlist, WordRole } from './contextpack';
import { ContextPackService } from './contextpack.service';


@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() simple ? = false;
  selected = 'true';


  constructor(private contextPackService: ContextPackService, private snackBar: MatSnackBar,private router: Router) { }

  ngOnInit(): void {
  }




  displayWords(wordlist: Wordlist, pos: WordRole){
    let words: string[];
    let str: string;
    if (wordlist[`${pos}`] === undefined){
      words = null;
      str = null;
    }
    else{
      let i: number;
      words = [];
        for (i = 0; i < wordlist[`${pos}`].length; i++) {
          words = words.concat(wordlist[`${pos}`][i].forms) ;
        }
        str = words.join(', ');
        str += '\n';
    }

    return str;
  }

  downloadJson(myJson: ContextPack, topic: string){
      myJson = this.convertToBetterJson(myJson);
      const sJson = JSON.stringify(myJson, null, 2);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
      element.setAttribute('download', topic + '.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      document.body.removeChild(element);
      return element;
}

  convertToBetterJson(jsonBetter: ContextPack){
    const obj: any =
      {
      $schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: jsonBetter.name,
      icon: jsonBetter.icon,
      enabled: jsonBetter.enabled,
      wordlists: jsonBetter.wordlists
      };
      return obj;
  }

  displayAllWords(contextpack: ContextPack, pos: WordRole){
      let words: Wordlist[];
      let m: number;
      let str: string;

      if(contextpack.wordlists === undefined || contextpack.wordlists[0][`${pos}`][0] === undefined){
        words = null;
        str = null;
      }
      else{
        words = [];
      for (m = 0; m < contextpack.wordlists.length; m++){
        if(contextpack.wordlists[m].enabled === true){
          words = words.concat(contextpack.wordlists[m]);
        }
        }

      let z: number;
      str = '\n';
      for (z = 0; z < words.length; z++){
        str += this.displayWords(words[z], pos);
        str = str.slice(0, -1);
        if (z < words.length-1 && !(words[z+1][`${pos}`][0]===undefined)){
          str += ', ';
          }
        }
      }
      return str;
  }


  setEnableOrDisable(element,wordlist: Wordlist,contextpack: ContextPack){

    if(wordlist !== null && contextpack !== null){
      if(element.textContent === 'disable'){
        element.textContent = 'enable';
        wordlist.enabled = false;
      }
      else{
        element.textContent = 'disable';
        wordlist.enabled = true;
      }
      this.submit(contextpack);
      return(wordlist.enabled.toString());}}



submit(cp: ContextPack) {
  this.contextPackService.updateContextPack(cp).subscribe(contextpack => {

    this.snackBar.open(cp.name[0].toUpperCase()+cp.name.substring(1,cp.name.length).toLowerCase()+ ' Pack is Updated ' , null, {
      duration: 2000,
    });
    this.router.navigate(['/contextpacks/' + cp._id]);
  }, err => {
    this.snackBar.open('Failed to update the pack', 'OK', {
      duration: 5000,
    });
  });}

saveAndRoute(cp: ContextPack){
  this.router.navigate(['edit/wordlist']);
  this.contextPackService.setData(cp);
}
}

