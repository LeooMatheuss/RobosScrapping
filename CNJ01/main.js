" use strict";

import Utils from "./utils.js"
import cheerio  from "cheerio"
import fs  from "node:fs"


 
export default class main {

  get siteurl() {
    return "https://comunica.pje.jus.br/consulta?siglaTribunal=TRF1&dataDisponibilizacaoInicio=2023-07-28&dataDisponibilizacaoFim=2023-07-28";
  }

  get texto() {
    return '[class="tab_panel2 ng-star-inserted"]';
  }

  get pages() {
    return '[class="ui-paginator-page ui-paginator-element ui-state-default ui-corner-all ng-star-inserted"]';
  }

  get fadein(){return '[class="card fadeIn"]' }

  get cnjformatado() {return 'span[class="numero-unico-formatado"]'}

  get sumary() {return 'div[class="info-sumary"]'}

  async execute() {
    const utils = new Utils()
    console.log(this.siteurl)
    await browser.url(this.siteurl);

    await utils.pageIsComplete();
    await browser.pause(5000);
    const arr = [];

    const paginas = await browser.$$(this.pages);
    for (const pagina of paginas) {
      await browser
        .$(this.fadein)
        .waitForDisplayed({ timeout: 60000 });

      const containers = await browser.$$(this.fadein);

      for (const ind of containers) {
        const temporaria = await browser.$(ind).getHTML();

        const $ = cheerio.load(temporaria);

        const processo = $(this.cnjformatado)
          .text()
          .trim();

        const obj = {};
        obj.numeroprocesso = processo.replace(/\D/g, "");

        const tabela = $(this.sumary)
          .get()
          .map((div) => {
            return $(div).text().trim();
          });

        obj.orgao = tabela[0];
        obj.datadisponibilidade = tabela[1];
        obj.tipocomunicacao = tabela[2];
        obj.meio = tabela[3];
        obj.partes = tabela[6];
        obj.conteudo = $(this.texto).text();
        arr.push(obj);
      }

      await browser.$(pagina).click();

      await utils.pageIsComplete();
    }

    //console.log(arr);

    fs.writeFileSync("./result.json", JSON.stringify(arr, null, 2));

    return arr;
  }
}

//module.exports = new main();
