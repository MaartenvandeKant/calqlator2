import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../iot.service';
import { Options } from 'ng5-slider';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { MatCheckbox } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import {CdkTableModule} from '@angular/cdk/table';
import beautify from 'xml-beautifier';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


// char.js ==> https://www.chartjs.org/docs/latest/axes/cartesian/linear.html
// ng slide ==> https://angular-slider.github.io/ng5-slider/docs
// xml writer ==> https://www.npmjs.com/package/xml-writer

// to do comments
// to do testing
// to do load cost for multiple risk levels
// to do load cost for multiple products
// to do remove un-used variables 
// test comment for git



@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  providers: [ConfigService],

  styleUrls: ['./investment.component.css']
})



export class InvestmentComponent implements OnInit {



public  XMLWriter = require('xml-writer');
public xw: any = [];



public barChartLabels:string[] = ['Bad Market', 'Nutral Market', 'Good Market'];
public barChartType:string = 'bar';
public barChartLegend:boolean = true;
public barChartOptions:any = {        
    responsive: true,
    
    scales:{
        xAxes:[{
            stacked:true
        }],
        yAxes:[{
            stacked:true,
            ticks: {
              suggestedMax: 500,
              suggestedMin: 0,
              
          }
        }]
    }
  };

 
// public barChartData:any[] = [[65, 59, 80, 81, 56, 55, 40],[65, 59, 80, 81, 56, 55, 40]];

color1 : string = 'rgba(0, 95, 95, .99)';
color2 : string = 'rgba(0, 139, 124, .99)';

public barChartData:any[] = [{data : [65, 70, 80], label: "Assets"},
{data: [5,6,7,], label : "Costs"}];


  public barChartColors: any = [
    {
      backgroundColor: this.color1,
      borderColor: this.color2,
    },
    {
      backgroundColor: this.color2,
      borderColor: this.color1,
    }
   
  ];


  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }

  @Input('product') product: string;


  /*goodMarketFactor: number = 1.1;
  nutralMarketFactor: number = 1;
  badMarketFactor: number = 0.95;
*/
  
marketFactor(market : string, risk : number) {
    /*          bad               nutral        good
      risk 1    0  + 1           1          0,5  1,5
      risk 2    -5   + 1,5           1          0     1,5
      risk 3    -1,5 +    
    */
    console.log("    calculatoin market factor for",market);
    let marketFactor = 0;
    if (market == 'nutral') {
      marketFactor = 0.01 + (risk*0.01) 
    }
    if (market == 'good') {
      marketFactor = 0.02 + (risk*0.02) 
    }
    return marketFactor; 

  }



  value: number = 100;
  //productCode = "ZBB";
  oneTimeDepositStepRange: number[] = this.createStepRange([
    { rangeLow: 0, rangeHigh: 250, rangeStep: 10 },
    { rangeLow: 250, rangeHigh: 1000, rangeStep: 50 },
    { rangeLow: 1000, rangeHigh: 5000, rangeStep: 200 },
    { rangeLow: 5000, rangeHigh: 10000, rangeStep: 1000 },
    { rangeLow: 10000, rangeHigh: 100000, rangeStep: 10000 },

  ]);
  recurringDepositStepRange: number[] = this.createStepRange([
    { rangeLow: 0, rangeHigh: 250, rangeStep: 10 },
    { rangeLow: 250, rangeHigh: 1000, rangeStep: 50 },
    { rangeLow: 1000, rangeHigh: 5000, rangeStep: 200 }
  ]);

  

  periodOptions: Options = {
    minLimit: 2,
    floor: 0,
    ceil: 42,
    showTicks: false,
    keyboardSupport: false,
    showSelectionBar: false
  };

  transactionOptions: Options = {
    floor: 0,
    ceil: 25,
    showTicks: false,
    keyboardSupport: false,
    showSelectionBar: false
  };

  oneTimeDepositOptions: Options = {
    showTicks: false,
    showTicksValues: false,
    showSelectionBar: true,
    keyboardSupport: false,
    stepsArray: this.oneTimeDepositStepRange.map((step: number) => {
      return { value: step };
    }),
    translate: (value: number): string => {
      return value.toString();
    }
  };

  
  // probably can go
  public riskLevelArray: any [] = [
      
    { value: 2, legend: 'Defensief' },
   
    { value: 4, legend: 'Matig offensief' },
   
    { value: 6, legend: 'Zeer offensief' }
  ]


  public riskLevelOptions: Options = {
    floor: 2,
    ceil: 6,
    step: 2,
    minLimit: 0,
    showTicks: false,
    showTicksValues: true,
    showSelectionBar: true,
    keyboardSupport: false,
    
    selectionBarGradient: {
      from: 'green',
      to: 'red'
    }

  };


  recurringDepositOptions: Options = {
    showTicks: false,
    showTicksValues: false,
    showSelectionBar: true,
    keyboardSupport: false,
    stepsArray: this.recurringDepositStepRange.map((step: number) => {
      return { value: step };
    }),
    translate: (value: number): string => {
      return value.toString();
    }
  };


  


  createStepRange(rangeList: Array<{ rangeLow, rangeHigh, rangeStep }>): number[] {
    // console.log(rangeList)

    const steps: number[] = [];
    rangeList.forEach(range => {
      for (let i: number = range.rangeLow; i <= range.rangeHigh; i = i + range.rangeStep) {
        steps.push(i);
      }
    });




    return steps;
  }




  public period: number = 2;
  public riskLevel: number = 2;
  priceJson: string;
  portfolioJson: string;
  //public variableServiceFeePercentage: number;

  public variableServiceFeeLevels: Array<{ lowerBand, upperBand, fee }>;
  public fixedMonthlyServiceFee: number;
  public oneTimeDeposit = 100;
  public recurringDeposit = 100;
  public transactions: number;
  public discountLevels = [];
  public tax: number;
  public currencyCost: number;
  public currencyPercentage: number;
  overviewXML : string;

  assetAllocationList = [];
  assetAllocationListForAllRisks =[];
  startyear: number = 2019
  public portfolio: any;
  public portfolio2: any;
  priceList: any;
  
  public allCosts:  any;

  public cumTotalDeposit: number;
  public cumTotalNutralMarketAssets: number;
  public cumTotalBadMarketAssets: number;
  public cumTotalGoodMarketAssets: number;
  public cumTotalNutralMarketCosts: number;
  public cumTotalBadMarketCosts: number;
  public cumTotalGoodMarketCosts: number;

  public productOptions : any;

  public chart: any;

  public initDone = false;

  constructor(private ConfigService: ConfigService) {
    console.log("start constructor");



  }


  ngOnInit() {


    console.log("==================================");
    console.log("start ngOnInit for", this.product);
    console.log("==================================");

    //this.productCode = this.product;
    // this.ConfigService.getJSON("./assets/riskWeigthedPortfolioDivision.json").subscribe(data => {
    
   
    this.ConfigService.getJSON("./assets/riskWeigthedPortfolioDivision.json").toPromise().then(data => {
      console.log("  Getting riskbased assetAllocationList");
      this.assetAllocationListForAllRisks = data.portfolioDevision[this.product];
     //this.assetAllocationList = data.portfolioDevision[this.product];
      this.portfolioJson = data;
      
      console.log("  ",this.assetAllocationListForAllRisks);
    });
    
    this.ConfigService.getJSON("./assets/pricesList.json").toPromise().then(data => {
      console.log("  Getting pricelist");
      this.priceJson = data;
      this.priceList = data[this.product].priceList;
      this.tax = data[this.product].tax;
      //this.currencyCost = data[this.product].currency;
      this.currencyPercentage = data[this.product].currencyPercentage;
      this.discountLevels = data[this.product].discountLevels;
      //this.variableServiceFeePercentage = 0 //data[this.product].variableServiceFeePercentage;
      this.variableServiceFeeLevels = data[this.product].variableServiceFeeLevels
      this.fixedMonthlyServiceFee = data[this.product].fixedMonthlyServiceFee;
      console.log("  ",this.priceList);
      //this.recalculate();
    });

    
    this.ConfigService.getJSON("./assets/productoptions.json").toPromise().then(data => {
      console.log("  Getting product Options");
      this.productOptions = data.productOptions[this.product][0];
      console.log("  ",this.productOptions); 
      //console.log("  ",this.productOptions.riskLevels);
      //console.log("  ",this.riskLevelOptions.stepsArray);
      //console.log("  ",this.riskLevelOptions.stepsArray);
      // get the risk level form the product optiens en set it to the slider
      this.riskLevelOptions.stepsArray = Object.assign([],this.productOptions.riskLevels)
      const newRiskOptions: Options = Object.assign({}, this.riskLevelOptions);
      this.riskLevelOptions = newRiskOptions;

      // get the risk Maximum Transactions per year form the product optiens en set it to the slider
      this.transactionOptions.ceil = this.productOptions.maxTransactions
      this.transactions = this.productOptions.startTransactions;
      const newTXOptions: Options = Object.assign({}, this.transactionOptions);
      this.transactionOptions = newTXOptions;  

      this.initDone = true

      
      

      this.recalculate();



    });


   
  }


  clean() {
    this.barChartData = [
      {data : [0,    0,      0], 
        label: "Assets",
        backgroundColor: 'window.chartColors.blue'},
      {data : [0,0,0], 
        label : "Costs",
        backgroundColor: 'rgba(60, 60, 80, 0.1)'
      }
    ];


    
    return

  }

  addElementToXML(elementName:string,atributeList={},endTag=false){
    this.xw.startElement(elementName);
    for (var k in atributeList){
      if (atributeList.hasOwnProperty(k)) {
           this.xw.writeAttribute(k, atributeList[k]);
      }
    }
    if (endTag){
      this.xw.endElement()
    }
  }

  closeElementInXML(){
    this.xw.endElement()
  }

  recalculate() {
    
    console.log(" ================ starting Cost calculation for", this.product)
    console.log(" ==============================================")
    console.log(" init is done", this.initDone )

    
    
    
   
    
    
 
    

    this.xw = new this.XMLWriter;
    this.xw.startDocument();
    this.addElementToXML('root')
   
    //this. xw.text('Some content');
    //this.xw.endElement();
    

    this.portfolio = []
    this.portfolio2 =[]
    this.allCosts = []
    let iPastAsset = 0;
    let iDeposit = 0;
    let iPastDeposit = 0;
    let iCumDeposit = 0;

    let iBadMarketAssets = 0;
    let iNutralMarketAssets = 0;
    let iGoodMarketAssets = 0;



    let iTotalBadMarketCosts = 0;
    let iTotalNutrakMarketCosts = 0;
    let iTotalGoodMarketCosts = 0;

    let iBadMarketVariableServiceFee = 0;
    let iNutralMarketVariableServiceFee = 0;
    let iGoodMarketVariableServiceFee = 0;

    let iCumBadMarketVariableServiceFee = 0;
    let iCumNutralMarketVariableServiceFee = 0;
    let iCumGoodMarketVariableServiceFee = 0;

    let iTotalBadMarketCost = 0;
    let iTotalNutralMarketCost = 0;
    let iTotalGoodMarketCost = 0;

    let iCumTotalBadMarketCost = 0;
    let iCumTotalNutralMarketCost = 0;
    let iCumTotalGoodMarketCost = 0;

    let iTotalTax = 0;

    let iCumTotalTax = 0;
    let iMarketAsset = []
    let iCumMarketAsset = []
    let iCumMarketTxCost = []
    let iCumMarketProdCost = []
    let y2 = []

    let iMarketVariableServiceFee = []
    let iCumMarketVariableServiceFee = []
    let iTotalMarketInstrumentCost = []
    let iMarketTxCost = []
    let iMarketProdCost = []
    let iFixexMarketServiceFee = [] 
    let iFixexCumMarketServiceFee = []

    let iGrandTotalCost = []
    let iGrandTotalCumCost = []

    let iMarketCurrencyCost = []
    let iMarketCumCurrencyCost = []

    let iMarketTypes = ['bad','nutral','good']
    for (var i in  iMarketTypes) {
        let market = iMarketTypes[i]

        // initialize
        iCumMarketAsset[market] = 0
        iFixexCumMarketServiceFee[market] = 0
        iCumMarketTxCost[market] = 0
        iCumMarketProdCost[market] = 0
        iMarketAsset[market] = 0
        //iMarketVariableServiceFee[market] = 0
        iCumMarketVariableServiceFee[market]  = 0
        //iTotalMarketInstrumentCost[market] = 0
        //iMarketTxCost[market] = 0
        //iMarketProdCost[market] = 0
        //console.log(" market asset for",market,":",iCumMarketAsset[market]);
        iFixexCumMarketServiceFee[market] = 0
        
        iGrandTotalCumCost[market] = 0

        iMarketCumCurrencyCost[market] = 0

        
    }



    let today = new Date();
    //this.xw.startElement('root');
    for (let index = 0; index < this.period; index++) {
      //this.xw.startElement('year');
      
      for (var i in  iMarketTypes) {
        let market = iMarketTypes[i]

        // initialize
        //iCumMarketAsset[market] = 0
        //iMarketAsset[market] = 0
        iMarketVariableServiceFee[market] = 0
        //iCumMarketVariableServiceFee[market]  = 0
        iTotalMarketInstrumentCost[market] = 0
        iMarketTxCost[market] = 0
        iMarketProdCost[market] = 0
        iFixexMarketServiceFee[market] = 0
        iGrandTotalCost[market] = 0

        iMarketCurrencyCost[market] = 0
       
        
    }
      console.log("calculation for year", index)
      let iyear = this.year(index);
      console.log("calculation for year", iyear)
      //this.xw.startElement('year');
      //this.xw.writeAttribute('year', iyear);
      //this.addElementToXML('year', {'year':iyear});
      
      
      let iDeposit = this.deposit(index, iPastDeposit);
      iCumDeposit = this.cumDeposit(index - 1, iDeposit);
      //this.addElementToXML('deposit', {'start':iPastDeposit,'end':iCumDeposit},true);
      //this.xw.endElement();  // end year
      iBadMarketAssets += iDeposit;
      iNutralMarketAssets += iDeposit;
      iGoodMarketAssets += iDeposit;

      
      //console.log("    market information ", iMarketAsset)
      for (var i in  iMarketTypes) {
        let market = iMarketTypes[i]
  
          iMarketAsset[market] += iDeposit
          //console.log("    market information ",iMarketAsset[key])
          iMarketAsset[market] = iMarketAsset[market] + iMarketAsset[market] * this.marketFactor(market,this.riskLevel);
          iCumMarketAsset[market] += iMarketAsset[market]

          iMarketVariableServiceFee[market] = this.variableServiceFee(iMarketAsset[market]);
          iCumMarketVariableServiceFee[market] += iMarketVariableServiceFee[market]

          // to do clculate iTotalMarketInstrumentCost of the total value in stead of deposit 
          // iTotalMarketInstrumentCost[market] = this.instrumentCost(iCumDeposit)
          iTotalMarketInstrumentCost[market] = this.instrumentCost(iCumDeposit)
          iMarketTxCost[market] = iTotalMarketInstrumentCost[market][0]
          iMarketProdCost[market] = iTotalMarketInstrumentCost[market][1]

          iCumMarketTxCost[market] += iMarketTxCost[market]
          iCumMarketProdCost[market] = iMarketProdCost[market]

          iFixexMarketServiceFee[market] = this.fixexServiceFee(today, iyear);
          iFixexCumMarketServiceFee[market] += iFixexMarketServiceFee[market]


          iGrandTotalCost[market] =  iMarketTxCost[market] + 
                                      iMarketProdCost[market] + 
                                      iMarketVariableServiceFee[market] + 
                                      iFixexCumMarketServiceFee[market]

          
          iGrandTotalCumCost[market] += iGrandTotalCost[market]

          //console.log("    market information ",iMarketAsset[key])
          //console.log("    market asset for",key,":",iMarketAsset[key]);
      }

      console.log("    new market assets",iMarketAsset);
      console.log("    new Cummarket assets",iCumMarketAsset);
      console.log("    new iMarketVariableServiceFee",iMarketVariableServiceFee);
      console.log("    new iCumMarketVariableServiceFee",iCumMarketVariableServiceFee);
      console.log("    new iTotalMarketInstrumentCost",iTotalMarketInstrumentCost);

      console.log("    new iMarketTxCost",iMarketTxCost);
      console.log("    new iMarketProdCost",iMarketProdCost);
     

      iBadMarketAssets = iBadMarketAssets + iBadMarketAssets * this.marketFactor('bad',this.riskLevel);
      console.log("    old market bad information ",iBadMarketAssets)
      iNutralMarketAssets = iNutralMarketAssets + iNutralMarketAssets * this.marketFactor('nutral', this.riskLevel);
      console.log("    old market nutral information ",iNutralMarketAssets)
      iGoodMarketAssets = iGoodMarketAssets +iGoodMarketAssets * this.marketFactor('good', this.riskLevel);
      console.log("    old market good information ",iGoodMarketAssets)

      iBadMarketVariableServiceFee =  this.variableServiceFee(iBadMarketAssets);
      iNutralMarketVariableServiceFee = this.variableServiceFee(iNutralMarketAssets);
      iGoodMarketVariableServiceFee = this.variableServiceFee(iGoodMarketAssets);


      iCumBadMarketVariableServiceFee += iBadMarketVariableServiceFee;
      iCumNutralMarketVariableServiceFee += iNutralMarketVariableServiceFee;
      iCumGoodMarketVariableServiceFee += iGoodMarketVariableServiceFee;

      console.log("calculation Fixed Services Fees");
      let iFixexServiceFee = this.fixexServiceFee(today, iyear);
      console.log("calculation Fixed Services Fees",iFixexServiceFee);

      console.log("calculation  Transaction and Product Costs")
      let iTotalInstrumentCost = this.instrumentCost(iCumDeposit);
      console.log("calculation  costs", iTotalInstrumentCost)
      let iTxCost = iTotalInstrumentCost[0]
      let iProdCost = iTotalInstrumentCost[1]
      let iTxDiscount = this.txDiscount(iTxCost);
      let iTax = this.tax * iDeposit;
      let iCurrencyCost = this.currencyCost * iDeposit;
      let iTotalFixedCost = + iTxCost - iTxDiscount + iCurrencyCost + iFixexServiceFee + iTax;

      iTotalBadMarketCost = iBadMarketVariableServiceFee + iTotalFixedCost;
      iTotalNutralMarketCost = iNutralMarketVariableServiceFee + iTotalFixedCost;
      iTotalGoodMarketCost = iGoodMarketVariableServiceFee + iTotalFixedCost;

      iCumTotalBadMarketCost += iTotalBadMarketCost;
      iCumTotalNutralMarketCost += iTotalNutralMarketCost;
      iCumTotalGoodMarketCost += iTotalGoodMarketCost;



      this.portfolio.push({
        "year": iyear,
        "deposit": iDeposit,
        "cumDeposit": iCumDeposit,

        "badMarketAssets": iBadMarketAssets,
        "nutralMarketAssets": iNutralMarketAssets,
        "goodMarketAssets": iGoodMarketAssets,

        "fixedServiceFee": iFixexServiceFee,

        "badMarketVariableServiceFee": iBadMarketVariableServiceFee,
        "nutralMarketVariableServiceFee": iNutralMarketVariableServiceFee,
        "goodMarketVariableServiceFee": iGoodMarketVariableServiceFee,

        "cumBadMarketVariableServiceFee": iCumBadMarketVariableServiceFee,
        "cumNutralMarketVariableServiceFee": iCumNutralMarketVariableServiceFee,
        "cumGoodMarketVariableServiceFee": iCumGoodMarketVariableServiceFee,

        "totalBadMarketCost": iTotalBadMarketCost,
        "totalNutralMarketCost": iTotalNutralMarketCost,
        "totalGoodMarketCost": iTotalGoodMarketCost,

        "cumTotalBadMarketCost": iCumTotalBadMarketCost,
        "cumTotalNutralMarketCost": iCumTotalNutralMarketCost,
        "cumTotalGoodMarketCost": iCumTotalGoodMarketCost,


        "txCost": iTxCost,
        "prodCost": iProdCost,
        "tax": iTax,
        "currencyCost": iCurrencyCost,
        "txDiscount": iTxDiscount

      });


      console.log( " setting the portfolio",iCumMarketAsset[iMarketTypes[0]])
     
      this.portfolio2.push({
        "year": iyear,
        "deposit": iDeposit,
        "cumDeposit": iCumDeposit,

        "badMarketAssets": iMarketAsset['bad'],
        "nutralMarketAssets": iMarketAsset['nutral'],
        "goodMarketAssets": iMarketAsset['good'],

        "fixedServiceFee": iFixexServiceFee,
        "badFixexMarketServiceFee": iFixexMarketServiceFee['bad'],
        "nutralFixexMarketServiceFee":iFixexMarketServiceFee['nutral'],
        "goodFixexMarketServiceFee":iFixexMarketServiceFee['good'],

        "badFixexCumMarketServiceFee": iFixexCumMarketServiceFee['bad'],
        "nutralFixexCumMarketServiceFee":iFixexCumMarketServiceFee['nutral'],
        "goodFixexCumMarketServiceFee":iFixexCumMarketServiceFee['good'],

        "badMarketVariableServiceFee": iMarketVariableServiceFee['bad'],
        "nutralMarketVariableServiceFee": iMarketVariableServiceFee['nutral'],
        "goodMarketVariableServiceFee": iMarketVariableServiceFee['good'],

        "cumBadMarketVariableServiceFee": iCumMarketVariableServiceFee['bad'],
        "cumNutralMarketVariableServiceFee": iCumMarketVariableServiceFee['nutral'],
        "cumGoodMarketVariableServiceFee": iCumMarketVariableServiceFee['good'],

        "totalBadMarketCost": iGrandTotalCost['bad'],
        "totalNutralMarketCost": iGrandTotalCost['nutral'],
        "totalGoodMarketCost": iGrandTotalCost['good'],

        "cumTotalBadMarketCost": iGrandTotalCumCost['bad'],
        "cumTotalNutralMarketCost": iGrandTotalCumCost['nutral'],
        "cumTotalGoodMarketCost": iGrandTotalCumCost['good'],


        
        "txBadMarketCost": iMarketTxCost['bad'],
        "txNutralMarketCost": iMarketTxCost['nutral'],
        "txGoodMarketCost": iMarketTxCost['good'],

        
        "badMarketProdCost": iMarketProdCost['bad'],
        "nutralMarketProdCost": iMarketProdCost['nutral'],
        "goodMarketProdCost": iMarketProdCost['good'],

        "tax": iTax,
        
        "currencyCost": iCurrencyCost,
        "badMarketCurrencyCost": iMarketCurrencyCost['bad'],
        "nutralMarketCurrencyCost": iMarketCurrencyCost['bad'],
        "goodarketCurrencyCost": iMarketCurrencyCost['bad'],

        "txDiscount": iTxDiscount

      });


      this.calall(iyear,iDeposit,iCumDeposit,iMarketAsset['bad'],)
      iPastDeposit = iCumDeposit;
      this.cumTotalDeposit = iCumDeposit;
      //this.xw.endElement('year');
      //this.xw.text('Some content');
    }
    //this.xw.endElement('root');
    //this.xw.flush();
    //this.xw.endDocument();
    
   

    this.cumTotalBadMarketAssets = iBadMarketAssets;
    this.cumTotalNutralMarketAssets = iNutralMarketAssets;
    this.cumTotalGoodMarketAssets = iGoodMarketAssets;
    this.cumTotalBadMarketCosts = iCumTotalBadMarketCost;
    this.cumTotalNutralMarketCosts = iCumTotalNutralMarketCost;
    this.cumTotalGoodMarketCosts = iCumTotalGoodMarketCost;
    
     
    /*this.barChartData = [
      this.cumTotalBadMarketAssets - this.cumTotalBadMarketCosts ,
      this.cumTotalNutralMarketAssets - this.cumTotalNutralMarketCosts ,
      this.cumTotalGoodMarketAssets - this.cumTotalGoodMarketCosts ];
  */
 /*
 this.barChartData = [
    {data : [this.cumTotalBadMarketAssets -     this.cumTotalBadMarketCosts,      this.cumTotalBadMarketCosts], label: "Bad"},
    {data : [this.cumTotalNutralMarketAssets -  this.cumTotalNutralMarketCosts ,  this.cumTotalNutralMarketCosts ], label : "Nutral"},
    {data : [this.cumTotalGoodMarketAssets -    this.cumTotalGoodMarketCosts ,    this.cumTotalGoodMarketCosts ], label : "Good"}];

  }
*/
  this.barChartData = [
    {data : [this.cumTotalBadMarketAssets,    this.cumTotalNutralMarketAssets,      this.cumTotalGoodMarketAssets], 
      label: "Assets",
      backgroundColor: 'window.chartColors.blue'},
    {data : [this.cumTotalBadMarketCosts ,  this.cumTotalNutralMarketCosts ,  this.cumTotalGoodMarketCosts ], 
      label : "Costs",
      backgroundColor: 'rgba(60, 60, 80, 0.1)'
    }
  ];
  this.xw.endDocument();
  this.overviewXML= beautify(this.xw.toString());
    console.error(beautify(this.xw.toString()));
 
}

calPrice({ year, costElement, amount, units = 1 }: { year: number; costElement: any; amount: number; units?: number; }):any {
  console.log("    calculatoin price_new");
  console.log("    year",year);
  console.log("    costElement",costElement);
  console.log("    amount/assets",amount);
  
  
  let cost = amount * costElement.price
  if (typeof costElement.costName !== 'undefined') { //staring cost apply
    
    this.xw.writeAttribute('Cost_Name', costElement.costName );
    
  }
  if (typeof costElement.price !== 'undefined') { //staring cost apply
    
    this.xw.writeAttribute('Cost_price_Percantage', costElement.price );
    
  }
  this.xw.writeAttribute('Apply_cost_to', amount );
    

  console.log("    initial per unitt",cost);
  if (typeof costElement.startingCost !== 'undefined') { //staring cost apply
    cost += costElement.startingCost
    this.xw.writeAttribute('startingCost', costElement.startingCost);
    console.log("    after starting per unir",cost);
  }
  if (typeof costElement.minCost !== 'undefined') { //minimum cost apply
    cost = Math.max(costElement.minCost,cost)
    this.xw.writeAttribute('minimum_Cost', costElement.minCost);
    console.log("    after applaying minimum cost per unir",cost);
  }
  if (typeof costElement.maxCost !== 'undefined') { //minimum cost apply
    cost = Math.min(costElement.maxCost,cost)
    this.xw.writeAttribute('Maximum_Cost', costElement.maxCost);
    console.log("    after applaying max cost per unir",cost);
  }
  
  
  
  console.log("    number of units(transactions) to applay cost to",units);
  this.xw.writeAttribute('Number_of_units', units);
  cost = cost * units
  this.addElementToXML('Cost_amount', {'amount':cost},true);
  console.log("    after applaying number of transaction",cost);
  
  return {"year":year,"amount":cost,"costName":costElement.costName, "costType":costElement.costType2}
}



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



calall(year,deposit,cumDeposit,cumAssets){
  const logging = true

  this.addElementToXML('Year', {'Year':year});
  this.addElementToXML('Deposits_this_year', {'amount':deposit},true);
  this.addElementToXML('Cum._Deposit', {'amount':cumDeposit},true);
  this.addElementToXML('Cum._Assets', {'amount':cumAssets},true);
  
        
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXX deposit",deposit)
  console.log("XXXXX year",year)
  console.log("XXXXX cumDeposit",cumDeposit)
  console.log("XXXXX cumAssets",cumAssets)
  
  this.assetAllocationList = this.getAssetAllocation()
  
  this.addElementToXML('Max_Cost_Elements', {'number':this.priceList.length});
  this.priceList.forEach(costElement => {
    console.log("XXXXX Cost Element",costElement)
    const assetAllocation = this.assetAllocationList.filter(asset => costElement.instrumentName == asset.assetName)
    this.addElementToXML('Cost_Element', {"Cost_Type":costElement.costType2});
       
    switch (costElement.costType2) {
      case "transactionRelated":
        //this.addElementToXML('Cost_Element', {"Cost_Type":costElement.costType2});
        
        console.log("XXXXX TransAction Releated Cost",costElement)
        console.log("XXXXX Cost Name",costElement.costName)
        console.log("XXXXX assetallocationlist", this.assetAllocationList)

        
        //const assetAllocation = this.assetAllocationList.filter(asset => costElement.instrumentName == asset.assetName)
        if (typeof assetAllocation !== 'undefined' ) {
          this.console_log("XXXXX allocation" + assetAllocation[0],logging,5,"M")
          this.xw.writeAttribute('Instrument_name', costElement.instrumentName);
          //this.xw.writeAttribute('Asset_allocation_fraction', assetAllocation[0].percentage);
          
          let iNumberOfTransactionsInThisInstrument = this.transactions * assetAllocation[0].percentage;
          let iSingleOrderTransactionAmountInThisInstrument = (this.productOptions.transactionCostPercentage * assetAllocation[0].percentage * cumAssets ) / this.transactions 

          this.allCosts.push(this.calPrice({ year, costElement, amount: iSingleOrderTransactionAmountInThisInstrument, units: iNumberOfTransactionsInThisInstrument }));
          
          console.log("XXXXX allCost", this.allCosts)
        } else {
          this.console_log("error no asset allocation found for Instrument cost element:" + costElement.instrumentName ,logging,5,"M")
        }
        console.log("XXXXX assetallocation for (",costElement.instrumentName,") ==>", assetAllocation)


        


        
        break;
      case "Product Related":
        console.log("XXXXX Product Releated Cost",costElement)
        console.log("XXXXX Cost Name",costElement.costName)
        if (typeof assetAllocation !== 'undefined' ) {
          this.console_log("XXXXX allocation" + assetAllocation[0],logging,5,"M")

          let iamount =  assetAllocation[0].percentage * cumAssets 
          this.xw.writeAttribute('Instrument_name', costElement.instrumentName);
          this.xw.writeAttribute('Asset_allocation', assetAllocation[0].percentage);
          this.allCosts.push(this.calPrice({ year, costElement, amount: iamount, units: 1 }));
          console.log("XXXXX allCost", this.allCosts)
          
          
        } else {
          this.console_log("error no asset allocation found for Instrument cost element:" + costElement.instrumentName ,logging,5,"M")
        }
        console.log("XXXXX assetallocation for (",costElement.instrumentName,") ==>", assetAllocation)

        break;
      case "Service Related":
        console.log("XXXXX Service Releated Cost",costElement)
        console.log("XXXXX Cost Name",costElement.costName)
        console.log("XXXXX Cost year",year)
        console.log("XXXXX cumulative assets",cumAssets)
        let partInThisLevel = this.partInlevel(costElement.lowerBand,costElement.upperBand,cumAssets);
        this.xw.writeAttribute('Lower_Band', costElement.lowerBand);
        this.xw.writeAttribute('Upper_Band', costElement.upperBand);
        this.xw.writeAttribute('Amount_in_Band', partInThisLevel);

        let iresult = [] 
        iresult = this.calPrice({ year, costElement, amount: partInThisLevel, units: 1 })
        if (iresult["amount"] > 0) {
          this.allCosts.push(iresult);
        }
        console.log("XXXXX All cost",this.allCosts) 
        
        break;
      default:
        console.log("XXXXX Undifenned Cost",costElement)
        console.log("XXXXXXXXXXXXXXXXXXXXXX")
        break;
      
      
    }
    this.xw.endElement()  // cost element
    
  });
  this.xw.endElement()  // cost list
  this.xw.endElement()  // year

}



  year(i: number) {

    return this.startyear + i;
  }

  /*asset (i: number,iStartAsset){
    let asset = 0;
    if (i==0) 
       asset = this.oneTimeDeposit;
    asset +=  this.recurringDeposit;  // multiply by * 12 is period is one month
    return  asset; 
  }
*/
  deposit(i: number, iStartAsset) {
    let deposit = 0;
    if (i == 0)
      deposit = this.oneTimeDeposit;
    deposit += this.recurringDeposit;  // multiply by * 12 is period is one month
    return deposit;
  }

  

  /*
    cumAsset (i,a) {
      let asset = a;
      if (i>=0)
        asset += this.portfolio[i].cumAsset;
  
      return asset;
    }
  */
  cumDeposit(i, a) {
    let deposit = a;
    if (i >= 0)
      deposit += this.portfolio[i].cumDeposit;

    return deposit;
  }

  fixexServiceFee(d: Date, year) {
    console.log("   fixexServiceFee ",d.getFullYear());
    console.log("   fixexServiceFee ",this.fixedMonthlyServiceFee);
    let ifixexServiceFee = 0;

    if (d.getFullYear() == year) {            
      ifixexServiceFee = (12 - d.getMonth()) * this.fixedMonthlyServiceFee;
    } else {
      ifixexServiceFee = 12 * this.fixedMonthlyServiceFee;
    }
    return ifixexServiceFee;
  }

  partInlevel (l,u,x):number {  // l = lower limt   u = upper limt     x= assets
    if (x>=u) { /// assets more than upper limit of this level
      return u-l  // send the complet band with of this level
    } else
    if (x<l)  { // if assets smaller than the lowe limt , noth falls in this band
      return 0
    } else // assets mus ly somewhen between lower and upper liit of this level
    {
      return x-l

    }


  }

  variableServiceFee(totalAsset: number) {
    console.log("calculation Service Fee for ",totalAsset)
    let ivariableServiceFeeLevels = this.variableServiceFeeLevels
    let cumLevelServicesFee = 0
    if (true) {
      
      for (let index = 0; index < ivariableServiceFeeLevels.length; index++) {
        
        let partInThisLevel = this.partInlevel(ivariableServiceFeeLevels[index].lowerBand,ivariableServiceFeeLevels[index].upperBand,totalAsset);
        
        console.log("   looping though services fee levels",index,"of",ivariableServiceFeeLevels.length)
        console.log("   this level (",totalAsset,") lowwer (",ivariableServiceFeeLevels[index].lowerBand,") upper (",ivariableServiceFeeLevels[index].upperBand,")");
        console.log("   this level fee",ivariableServiceFeeLevels[index].fee)
        console.log("   part in this level",partInThisLevel);
        let levelServicesFee = partInThisLevel * ivariableServiceFeeLevels[index].fee
        console.log("   Services fee for this level ",levelServicesFee);
        cumLevelServicesFee =  cumLevelServicesFee +  levelServicesFee;
        console.log("   Cum. Services fee for this level ",cumLevelServicesFee);
        
      }
    } else {
      console.log("     no variableServiceFeeLevels defined")
    }

    return cumLevelServicesFee;
  }

  txDiscount(txCost) {
    let iTxDiscount = 0;

    if (this.discountLevels) {
      for (let index = 0; index < this.discountLevels.length; index++) {
        let iDiscountLevel = this.discountLevels[index];

        if (txCost > iDiscountLevel.lowerBand) { // dicount applies
          if (txCost > iDiscountLevel.upperBand) { //full discount applies

            iTxDiscount += (iDiscountLevel.upperBand - iDiscountLevel.lowerBand) * iDiscountLevel.variableDiscount;




          } else { //some discount applies
            iTxDiscount += (txCost - iDiscountLevel.lowerBand) * iDiscountLevel.variableDiscount;


          }
        }



      }
    }
    return iTxDiscount;
  }

  getAssetAllocation ():any[] {
    console.log(" finiding the applicable risk ralated assetallocations. Risk Level:",this.riskLevel)
    
    let anAssetAllocationList = []
    let iFoundRiskRelatedAssetAlocations = false;
    for (let r = 0; r < this.assetAllocationListForAllRisks.length; r++) {
      // this is a nasty way to make sure that at least one portfolio match the risk
      // if  it's the right one we stop the for loop
      anAssetAllocationList = this.assetAllocationListForAllRisks[r].assetAlocation;
      if (this.assetAllocationListForAllRisks[r].riskLevel == this.riskLevel)
      {
        console.log(" FoundRiskRelatedAssetAlocations found!!!",this.assetAllocationList);
        
        //console.log(this.assetAllocationList);
        iFoundRiskRelatedAssetAlocations = true;
        return anAssetAllocationList
      }
      
      //console.log("asset allocation list =======");
      //console.log(this.riskLevel);
      //console.log(this.assetAllocationList);
    }
    if (!iFoundRiskRelatedAssetAlocations) {
      console.log(" No risk related asses allocations found !!!");
      console.log(" using default");
      return anAssetAllocationList;
    }

    console.log(" No asset allocation list at all, we better stop.");

  }

  


  instrumentCost(totalAsset: number) {
    //console.log("start txCost")
    let icost = 0;
    let iPCost = 0;
    let itax = 0;
    let iDiscount = 0;
    //console.log(this.assetAllocationList);


    //Lets get the right asset mix from the assetAllocationListForAllRisks
    //console.log("Risk associated asset allocation list");
    //console.log(this.assetAllocationListForAllRisks);


    console.log(" calulating transactions cost for product ",this.product)
  
  
    this.assetAllocationList = this.getAssetAllocation()
  

    console.log(" calulating transactions cost for ",this.product," and for  ",this.assetAllocationList.length, "Assets")
    console.log(" Asset llocation",this.assetAllocationList)
   
    // def: instrument is a type of stock
    // def: asset is a stock that is part of a portfolio
    //
    // loop(1) through the list of asset allocations in the example portfolio based on product and risk level
    // for each element(instrument) in the example portfolio get the list off prices that are associated with that asses based on its name
    // loop 2 though that list of prices and calculat the price of the 
    // 




    console.log( " lets iterate over the assets that are alocated")
    for (let index = 0; index < this.assetAllocationList.length; index++) {
      console.log( "   asset number",index + 1)
      const assetAllocation = this.assetAllocationList[index];

      console.log("     Looking for the right price list in", this.priceList);
      console.log("     identified by: ", assetAllocation.assetName);
      
      const instrumentPricesInfo = this.priceList.filter(instrument => instrument.instrumentName == assetAllocation.assetName);
      
      console.log("     instrument price Information array", instrumentPricesInfo)

      
      // make sure a instrument type can have more than one cost by handling an array as a result from the filte
      console.log("     Name", assetAllocation.assetName);
      console.log("     share of portfolio:", assetAllocation.percentage);
      console.log("     Instrument price infor:", instrumentPricesInfo);
      

      
      if (instrumentPricesInfo.length > 0) {
        console.log("yes! instrumentPricesInfo lenght > 0")
        let instrumentPrice = instrumentPricesInfo[0];
        console.log("     Instrument price infor:", instrumentPrice);
        
        
        if (instrumentPrice.transactionCostPercentage > 0) {

         
             console.log("     Transaction Cost apply for this intrument");
             console.log("     Cost is ", instrumentPrice.transactionCostPercentage," of single order amount ");
            //console.log("variable cost <===");
            //console.log(this.transactions);

            
            console.log ("     Order number")
            console.log ("       Total number of transactions in this portfolio:" , this.transactions );
            let iNumberOfTransactionsInThisInstrument = this.transactions * assetAllocation.percentage;
            console.log ("       Number of transactions allocated to this instrument ==> #tx (",this.transactions,") * asset allocation (",assetAllocation.percentage,") = " , iNumberOfTransactionsInThisInstrument );
            console.log ("     Order number ===> ", iNumberOfTransactionsInThisInstrument)
            
            console.log ("     Order amount")
            console.log ("       Assets till now " , totalAsset );
            console.log ("       part of assets concerend with ordering each year = " , this.productOptions.transactionCostPercentage );
            let iTotalOrderAmount = this.productOptions.transactionCostPercentage * totalAsset;
            console.log ("       Assets in orders (assets * % of assests in orders) ", iTotalOrderAmount)
            let iTotalInstrumentOrderAmount = iTotalOrderAmount / assetAllocation.percentage;
            console.log ("       Assets in orders in this instrument (Assets in orders",iTotalOrderAmount," / assetAllocation.percentage",assetAllocation.percentage,") ", iTotalInstrumentOrderAmount) 
            let iSingleTransactionAmount = (this.productOptions.transactionCostPercentage * totalAsset ) / this.transactions
            console.log ("       Single Order Amount in this" ,iSingleTransactionAmount)
            console.log ("       Order amount ====>", iSingleTransactionAmount)

            console.log ("     Price")
            console.log ("        Variable price is ", instrumentPrice.transactionCostPercentage," of each order amount (",iSingleTransactionAmount,")");
            let iVariableOrderCost = instrumentPrice.transactionCostPercentage * iSingleTransactionAmount
            console.log ("        Variable price is ", iVariableOrderCost);

            let iStartingCost = 0;
            if (instrumentPrice.startingCost) {
              iStartingCost =instrumentPrice.startingCost;
              console.log("        It has a Staring Price of", instrumentPrice.startingCost);
              
            }

            let iSingleOrderCost = instrumentPrice.startingCost + iVariableOrderCost
            console.log ("        Single order Cost  ",iSingleOrderCost)


            console.log ("        Instrument Minimum Price is ",instrumentPrice.minCost)
            console.log ("        Instrument Maximum Price is ",instrumentPrice.maxCost,typeof instrumentPrice.maxCost)


            let iFinalSingleOrderCost = iSingleOrderCost
            
            if (typeof instrumentPrice.minCost !== 'undefined'){  
              iFinalSingleOrderCost = Math.max(iFinalSingleOrderCost, instrumentPrice.minCost)
            
            }  


            if (typeof instrumentPrice.maxCost !== 'undefined'){   
              iFinalSingleOrderCost = Math.min(iFinalSingleOrderCost, instrumentPrice.maxCost)
            }

            console.log ("        Final single order price is (including min,max) ", iFinalSingleOrderCost)
            
            let iTotalInstrumentCost = iFinalSingleOrderCost * iNumberOfTransactionsInThisInstrument
            console.log ("        Total order Cost in this instrument is ", iTotalInstrumentCost)
            console.log ("        (Single Order Cost (",iFinalSingleOrderCost,") * #Tx in this instrument (",iNumberOfTransactionsInThisInstrument,"))= ")
            console.log ("        Price ===> ", iTotalInstrumentCost)

            
            
            icost += iTotalInstrumentCost
            console.log ("      ====> Total Order cost cost of ",index + 1," out of ",this.assetAllocationList.length," instuments  ===> ", icost)
            //console.log(icost);
            console.log ("      =================================");
            


        }
        if (instrumentPrice.productCostPercentage > 0) {
          console.log("     Running Product Cost of (",instrumentPrice.productCostPercentage,") apply for this intrument");
          console.log("     Asset allocation is (",assetAllocation.percentage,")");
          console.log("     Assetis till now (",totalAsset,") apply for this intrument");
          iPCost = instrumentPrice.productCostPercentage * totalAsset * assetAllocation.percentage
          console.log("     Product Cost for this year  (",iPCost,") ");
        }

      
       let iTaxCosts = 0
       if (typeof instrumentPrice.taxCost !== 'undefined') {
          console.log("     For this instument there are tax Cost of (",instrumentPrice.taxCost,") apply for this intrument");
          console.log("     Asset allocation is (",assetAllocation.percentage,")");
          console.log("     Assetis till now (",totalAsset,") apply for this intrument");
          iTaxCosts = instrumentPrice.taxCost * totalAsset * assetAllocation.percentage
          console.log("     instrumentPrice.taxCost  (",iTaxCosts,") ");
        }
        break;

      } 
      


    }
    console.log("    returning cost ",[icost,iPCost])
    return [icost,iPCost];
  }

  console_log(message:string,log=true,level=5,c="-"){
    if (log){
      console.log(c.repeat(level),message)
    }
      
  }

}
//// hi

