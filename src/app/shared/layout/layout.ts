import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet],
    template: `
        <nav class="p-4 border-b">navbar (placeholder)</nav>
        <main>
        <router-outlet />
        </main> 
    `,
})

export class Layout {}