import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatCompletion, ProductType } from '@chat-bot/data-access';
import { ApiService } from './api.service';
@Injectable({
    providedIn: 'root'
})
export class ChatbotService {


    constructor(private api: ApiService) { }

    getProductTypes(): Observable<ProductType[]> {
        const url = '/ChatBot/product-type'
        return this.api.getFromPublicApi<ProductType[]>(url).pipe();
    }
    completions(productTypeValue: number, message: string): Observable<ChatCompletion> {
        const apiUrl = '/ChatBot/completions';
        const formData = new FormData();
        formData.append('ProductTypeValue', productTypeValue.toString());
        formData.append('Message', message);
        return this.api.postFormDataToPublicApi<ChatCompletion>(apiUrl, formData).pipe()
    }
}