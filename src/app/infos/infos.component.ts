
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Tile } from '../models/tile.model';
import { Infos } from '../models/infos.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';



export interface DialogData extends Tile {
  
}
@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})


export class InfosComponent implements OnInit {
  baseUrl ="https://pure-retreat-07717.herokuapp.com/"
  teachers=["Véronique","Emmanuelle","Vanessa","Claudia","Patrice","Françoise","Mélodie","Muriel"]
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private http: HttpClient,private dialogRef: MatDialogRef<InfosComponent>,private _snackBar: MatSnackBar) {
    
    data.empty=false
    this.http.put(this.baseUrl+'lottery',this.data).subscribe(resp=>console.log(resp))
   }

  ngOnInit(): void {
  }

  fillInfos(form: NgForm,tile:Tile){

    this.http.get(this.baseUrl+'lottery/phone/'+form.value.phone).subscribe((num:Number)=>{
        if(num<3){
          const infos=new Infos()
          infos.class=form.value.teacher
          infos.name=form.value.name 
          infos.firstName=form.value.firstName 
          infos.childFirstName=form.value.childFirstName
          infos.childName=form.value.childName
          infos.mail=form.value.mail 
          infos.phone=form.value.phone
          tile.content=infos
          this.http.put(this.baseUrl+'lottery',tile).subscribe(resp=>console.log(resp))
          this.dialogRef.close(tile)
        }
        else{
          this._snackBar.open('Désolé, vous avez déjà participé 3 fois', 'OK', {
            duration: 5000,
            panelClass: ['danger']
          });
          this.dialogRef.close()
        }
    })
    

  }

}
