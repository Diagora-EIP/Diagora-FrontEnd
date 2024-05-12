// Import necessary modules
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-carte',
    templateUrl: './carte.component.html',
    styleUrls: ['./carte.component.scss'],
})
export class CarteComponent {
    user: string = localStorage.getItem('name') || '';
    userId?: number;
    date?: string;
    redirectEventDate: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            if (params.has('date')) {
                this.redirectEventDate = params.get('date');
				const user_id_str: string | null = params.get('user_id');;
				const user_id = parseInt(user_id_str ?? '0', 10);
                this.userId = user_id;
                const user_name = params.get('user_name');

                // console.log("user name", user_name)
                this.user = user_name || '';
                const originalDate = new Date(this.redirectEventDate!);
                const date = originalDate.toISOString().split('T')[0];
                this.date = date;

                this.cdr.detectChanges();
            }
        });
    }
}
