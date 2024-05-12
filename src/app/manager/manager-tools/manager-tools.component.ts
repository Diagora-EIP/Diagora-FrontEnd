import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  
      this.result = mockResponses[this.selectedTool];
      console.log('Result:', this.result);
    }
  }
}
