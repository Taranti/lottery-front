import { MatInputModule } from '@angular/material/input';
import { InfosComponent } from './infos/infos.component';
import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { Tile } from './models/tile.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lottery';
  dialogRef: MatDialogRef<InfosComponent>
  baseUrl ="https://pure-retreat-07717.herokuapp.com/"
  lottery:Tile[]=[]
  constructor(public dialog:MatDialog,private http: HttpClient,private _snackBar: MatSnackBar) {
    this.http.get(this.baseUrl+'lottery').subscribe(res=>{
      this.lottery=_.map(res,(dbTile)=>{
        const tile=new Tile()
        tile.id=dbTile.id 
        tile.empty=dbTile.empty
        return tile
      })
      console.log(this.lottery)
    })
   
  }

  openDialog(tile:Tile) {
     this.dialog.open(InfosComponent,{data:{tile}});
  }
  async fill(tile:Tile){
    //if(tile.empty){
      console.log(tile.id)
      //tile.empty=false
      let dbTile;
      await this.http.get(this.baseUrl+'lottery/'+tile.id).subscribe((resp:any)=>{
        console.log(resp)
        if(resp.empty){
          this.dialogRef=this.dialog.open(InfosComponent,{data:tile})
          this.dialogRef.afterClosed().subscribe(tileTest=>{
            console.log(tileTest)
            if(!tileTest){
              tile.empty=true
              this.http.put(this.baseUrl+'lottery',tile).subscribe(resp=>console.log(resp))
            }
          })
        }
        else{
          this._snackBar.open('Cette case est déjà remplie', 'OK', {
            duration: 5000,
            panelClass: ['danger']
          });
        }
      })
      
      
    /*}
    else{
      console.log(tile)
    }*/
  }
}
