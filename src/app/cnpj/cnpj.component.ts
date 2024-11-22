import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CnpjService } from './cnpj.service';

@Component({
  selector: 'app-cnpj',
  templateUrl: './cnpj.component.html',
  styleUrls: ['./cnpj.component.css']
})
export class CnpjComponent implements OnInit {
  @Input() titleHome = 'Consultando CNPJ';
  buscaCNPJ: string = '';
  buscar: boolean = false;
  constructor(
    private cnpjService: CnpjService,
    private messageService: MessageService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Buscando CNPJ');
  }

  buscarCNPJ(buscaCNPJ: any, form: any) {
    if (buscaCNPJ && buscaCNPJ.length >= 14) {
      this.cnpjService.consultaCNPJ(buscaCNPJ).subscribe({
        next: (dados: any) => {
          this.buscar = true;
          setTimeout(() => {
            this.populaCNPJForm(dados, form);
            console.log('Dados recebidos com sucesso');
          }, 100);
        },
        error: (e: any) => {
          this.resetaCNPJForm(form);
          this.buscar = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Atenção',
            detail: 'Erro ao buscar CNPJ!'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'CNPJ inválido ou incompleto!'
      });
    }
  }

  populaCNPJForm(dados: any, formulario: any) {
    formulario.form.patchValue({
      razaoSocial: dados.razao_social,
      nomeFantasia: dados.nome_fantasia,
      endereco: dados.logradouro,
      cidade: dados.municipio,
      estado: dados.uf
    });
  }

  resetaCNPJForm(formulario: any) {
    formulario.form.patchValue({
      razaoSocial: null,
      nomeFantasia: null,
      endereco: null,
      cidade: null,
      estado: null
    });
    this.buscar = false;
  }
}