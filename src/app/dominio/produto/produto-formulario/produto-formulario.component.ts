import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { Produto } from '../produto';
import { ProdutoService } from '../produto.service';
import { Categoria } from '../../categoria/categoria';
import { CategoriaService } from '../../categoria/categoria.service';
import { Modalidade} from '../../modalidade/modalidade';
import { ModalidadeService} from '../../modalidade/modalidade.service';


@Component({
  selector: 'produto-lista',
  templateUrl: './produto-formulario.component.html',
  styleUrls: ['./produto-formulario.component.css']
})
export class ProdutoFormularioComponent implements OnInit {

  produto: Produto;
  produtoForm: FormGroup;
  titulo: string;
  categorias: Categoria[];
  modalidades: Modalidade[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private modalidadeService: ModalidadeService
  ) { }

  ngOnInit() {

    this.produto = new Produto();

    /* Obter o `ID` passado por parâmetro na URL */
    this.produto.id = this.route.snapshot.params['id'];

    /* Altera o título da página */
    this.titulo = (this.produto.id == null) 
    ? 'Novo Produto' 
    : 'Alterar Produto';

    /* Reactive Forms */
    this.produtoForm = this.builder.group({
      id: [],
      nome: this.builder.control('', [Validators.required, Validators.maxLength(50)]),
      modalidade: this.builder.control('', [Validators.required, Validators.maxLength(50)]),
      descricao: this.builder.control('', [Validators.required]),
      preco: this.builder.control('', [Validators.required]),
      categoria: this.builder.control('', [Validators.required])
    }, {});

       // busca as categorias
       this.categoriaService.buscarTodos().subscribe( resposta => {
        this.categorias = resposta;
      })

        // busca as modalidades
        this.modalidadeService.buscarTodos().subscribe( resposta => {
          this.modalidades = resposta;
        })

    // Se existir `ID` realiza busca para trazer os dados
    if (this.produto.id != null) {
      this.produtoService.buscarPeloId(this.produto.id)
        .subscribe(retorno => {

          // Atualiza o formulário com os valores retornados
          this.produtoForm.patchValue(retorno);

        });
    }

  }

  salvar(produto: Produto) {
    if (this.produtoForm.invalid) {
      console.log("Erro no formulário");
    } 
    else {
      this.produtoService.salvar(produto)
      .subscribe(response => {
        console.log("Curso salvo com sucesso");

        // retorna para a lista
        this.router.navigate(['/produto']);
      },
      (error) => {
        console.log("Erro no back-end");
      });
    }
  }
  compararFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
