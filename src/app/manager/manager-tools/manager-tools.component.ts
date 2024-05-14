import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';

@Component({
  selector: 'app-manager-tools',
  templateUrl: './manager-tools.component.html',
  styleUrls: ['./manager-tools.component.scss']
})
export class ManagerToolsComponent {
  selectedTool: string | null = null;
  result: any;

  constructor(private http: HttpClient) {}

  onToolClick(toolName: string) {
    console.log('Clicked tool:', toolName); // Add this line for debugging
    this.selectedTool = toolName;
  }

  launchTool() {
    if (this.selectedTool) {
      const mockResponses: { [key: string]: any } = {
        ForeCast: { message: "This is the result for Tool 1", data: { example: "data" } },
        MissingDelivery: { message: "This is the result for Tool 2", data: { example: "data" } },
        Stats: { message: "This is the result for Tool 3", data: { example: "data" } }
      };
      let token = localStorage.getItem('token');
      let user_id = localStorage.getItem('id');
      let header: any = {};
      let apiUrl = environment.apiUrl;
      if (token != null) {
        header = {
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
            },
        };
      }
      console.log(this.selectedTool, this.result); // Add this line for debugging
      if (this.selectedTool === "ForeCast") {
        this.http.get<any>(
          `${apiUrl}/prediction/`,
          header
        ).subscribe((response: any) => {
          console.log('Response:', response); // Add this line for debugging
          this.result = response[0];
        }
      );
      }
      console.log('Result:', this.result);
    }
  }
}
