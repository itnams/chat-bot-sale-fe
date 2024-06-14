import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '@chat-bot/services';
import { BehaviorSubject } from 'rxjs';
import { ProductType } from '@chat-bot/data-access';

interface Message {
  sender: string;
  text: string;
}


@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  deviceSelected = false;
  selectedDevice?: number;
  message: string = '';
  messages$ = new BehaviorSubject<Message[]>([]);
  productTypes$ = new BehaviorSubject<ProductType[]>([])
  isLoading$ = new BehaviorSubject<Boolean>(false);
  constructor(private service: ChatbotService) {
    this.getProductTypes()
  }

  getProductTypes() {
    this.service.getProductTypes().subscribe(resp => {
      this.productTypes$.next(resp)
    })
  }

  selectDevice(device: number) {
    this.deviceSelected = true;
    this.selectedDevice = device;
  }

  sendMessage() {
    if (this.message.length != 0) {
      const msgPost = this.message
      this.message = "";
      this.isLoading$.next(true)
      this.messages$.value.push({ sender: 'user', text: msgPost });
      this.service.completions(this.selectedDevice ?? 1, msgPost).subscribe(resp => {
        this.isLoading$.next(false)
        const indexEnd = resp.choices[0].message.content.indexOf("<|")
        let message = resp.choices[0].message.content
        if(indexEnd != -1){
          message = resp.choices[0].message.content.substring(0, indexEnd)
        }
        const newMessage = { sender: 'bot', text: `Bot trả lời: ${message}` };
        this.messages$.next([...this.messages$.getValue(), newMessage]);
      })
    }
  }
}
