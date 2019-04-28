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
    { rangeLow: 0,      rangeHigh: 100,     rangeStep: 10 },
    { rangeLow: 100,    rangeHigh: 1000,    rangeStep: 100 },
    { rangeLow: 1000,   rangeHigh: 10000,   rangeStep: 1000 },
    { rangeLow: 10000,  rangeHigh: 100000,  rangeStep: 10000 },
    { rangeLow: 100000, rangeHigh: 1000000, rangeStep: 100000 },

  ]);
  recurringDepositStepRange: number[] = this.createStepRange([
    { rangeLow: 0,      rangeHigh: 100,        rangeStep: 10 },
    { rangeLow: 100,     rangeHigh: 1000,      rangeStep: 100 },
    { rangeLow: 100,    rangeHigh: 10000,      rangeStep: 1000 }
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
  public oneTimeDeposit = 1000;
  public recurringDeposit = 100;
  public transactions: number;
  public discountLevels = [];
  public tax: number;
  public currencyCost: number;
  public currencyPercentage: number;
  overviewXML : string;
  overviewArray : any;

  assetAllocationList = [];
  assetAllocationListForAllRisks =[];
  startyear: number = 2019
  public portfolio: any;
  public portfolio2: any;
  priceList: any; 
  
  public allCosts:  any;

  //public cumTotalDeposit: number;
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

  record(m,key,v,overwrite=false){  // m= map
    
    let current_value = m.get(key)
    //console.error("befor ",key, " is", current_value, "and new is",v)
    if ((typeof current_value !== 'undefined') && !overwrite){
      v += current_value
     
    }
    //console.error("after ",key, " is", v)
    m.set(key,v)
   
  }

  recalculate() {
    this.overviewArray = []


    
    

    console.log(" ================ starting Cost calculation for", this.product)
    console.log(" ==============================================")
    console.log(" init is done", this.initDone )

    
    

    this.xw = new this.XMLWriter;
    this.xw.startDocument();
    this.addElementToXML('root')
    this.addElementToXML('input')
    this.addElementToXML('Riks',{"level":this.riskLevel},true)
    this.addElementToXML('One_time_deposit',{"amount":this.oneTimeDeposit},true)
    this.addElementToXML('Recurring_deposit',{"amount":this.recurringDeposit},true)
    this.addElementToXML('Numer_of_transactions',{"amount":this.transactions},true)
    this.addElementToXML('Investment_period',{"years":this.period},true)
    this.closeElementInXML(); // close input

   
    //this. xw.text('Some content');
    //this.xw.endElement();
    

    this.portfolio = []
    this.portfolio2 =[]
    this.allCosts = []
    //let iPastAsset = 0;
    
    //let iPastDeposit = 0;
    let iCumDeposit = 0;

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
    let iDeposit = this.oneTimeDeposit + this.recurringDeposit

    
    
   
    
    

    
    //console.error(this.overviewArray);
    iCumDeposit = iDeposit
    for (var i in  iMarketTypes) {
        let market = iMarketTypes[i]

        // initialize
        iCumMarketAsset[market] = iDeposit
        iFixexCumMarketServiceFee[market] = 0
        iCumMarketTxCost[market] = 0
        iCumMarketProdCost[market] = 0
        iMarketAsset[market] = 0
        //iMarketVariableServiceFee[market] = 0
        iCumMarketVariableServiceFee[market]  = 0
      
        iFixexCumMarketServiceFee[market] = 0
        
        iGrandTotalCumCost[market] = 0

        iMarketCumCurrencyCost[market] = 0
        //console.error("======new map==============")
        this.overviewArray[market+"_total"] = new Map();
       
        
    }
    this.overviewArray["user_input"]        = new Map();
   
    
    this.record(this.overviewArray["user_input"] ,"Numver_of_transations",this.transactions,true)
    this.record(this.overviewArray["user_input"] ,"one_time_deposit",this.oneTimeDeposit,true)
    this.record(this.overviewArray["user_input"] ,"recurrint_deposit",this.recurringDeposit,true)
    this.record(this.overviewArray["user_input"] ,"years",this.period,true)
    this.record(this.overviewArray["user_input"] ,"Risk_level",this.riskLevel,true)

    let today = new Date();
    //this.xw.startElement('root');
    for (let index = 0; index < this.period; index++) {
      //this.xw.startElement('year');
     
      
      for (var i in  iMarketTypes) {
        let market = iMarketTypes[i]
        iMarketVariableServiceFee[market] = 0
        iTotalMarketInstrumentCost[market] = 0
        iMarketTxCost[market] = 0
        iMarketProdCost[market] = 0
        iFixexMarketServiceFee[market] = 0
        iGrandTotalCost[market] = 0
        iMarketCurrencyCost[market] = 0
       
        
    }
      //console.log("calculation for year", index)
      let iyear = this.year(index);
      //console.error("======new year==============",iyear)
      console.log("calculation for year", iyear)
  
      

      this.addElementToXML('Year', {'Year':iyear});
      this.addElementToXML('Deposits_this_year', {'amount':iDeposit},true);
     
      //this.addElementToXML('Cum._Deposit', {'amount':cumDeposit},true);
     
     
      
      for (var i in  iMarketTypes) {
       
        
        let market = iMarketTypes[i]

        this.overviewArray[iyear+market] = new Map();
        this.overviewArray[iyear+market].set('Deposits_this_year',iDeposit)
        this.record(this.overviewArray[market + "_total"],"Cum_Deposits",iDeposit)
        
        iCumMarketAsset[market] += iCumMarketAsset[market] * this.marketFactor(market,this.riskLevel);
        this.record(this.overviewArray[market + "_total"],"Cum_MarketAsset",iCumMarketAsset[market],true)
          
        this.addElementToXML('Market', {'situation':market});
        this.addElementToXML('Cum_Assets', {'amount':iCumMarketAsset[market]},true);
        this.overviewArray[iyear+market].set('Cum_assets',iCumMarketAsset[market])
         // this.addElementToXML('Market', {"Situation":market});
         //console.error("======call calall==============")
          this.calall(iyear,iDeposit,iCumDeposit,iCumMarketAsset[market],market) /// replace imaker assets with imaerket cium assets
           iCumMarketAsset[market] = iCumMarketAsset[market] + this.recurringDeposit
        
        this.closeElementInXML()  // close market
        
      }
      this.closeElementInXML()  //year

        

         
     
      iDeposit = this.recurringDeposit
      iCumDeposit += iDeposit
    }
  
  /*
  this.barChartData = [
    {data : [this.cumTotalBadMarketAssets,    this.cumTotalNutralMarketAssets,      this.cumTotalGoodMarketAssets], 
      label: "Assets",
      backgroundColor: 'window.chartColors.blue'},
    {data : [this.cumTotalBadMarketCosts ,  this.cumTotalNutralMarketCosts ,  this.cumTotalGoodMarketCosts ], 
      label : "Costs",
      backgroundColor: 'rgba(60, 60, 80, 0.1)'
    }
  ];

  this.overviewArray["bad_total"].get("Cum_MarketAsset")

  */
 for (var i in  iMarketTypes) {
    console.error(this.overviewArray["bad_total"].keys())
    let keys = this.overviewArray["bad_total"].keys()
    let total = 0
    console.error("total",total)
    this.overviewArray[iMarketTypes[i]+"_total"].forEach(function(v, k) {
      if (k.substring(0, 4) == "Cat_") {
        total += v
        console.error("total",total)
      }      
    })
    this.record(this.overviewArray[iMarketTypes[i] + "_total"],"Toal_Cum_Cost",total,true)
      
  }
   
  this.barChartData = [
    {data : [this.overviewArray["bad_total"].get("Cum_MarketAsset"),    this.overviewArray["nutral_total"].get("Cum_MarketAsset"),      this.overviewArray["good_total"].get("Cum_MarketAsset")], 
      label: "Assets",
      backgroundColor: 'window.chartColors.blue'},
    {data : [this.overviewArray["bad_total"].get("Toal_Cum_Cost") , 
             this.overviewArray["nutral_total"].get("Toal_Cum_Cost") , 
             this.overviewArray["good_total"].get("Toal_Cum_Cost")
            ], 
      label : "Costs",
      backgroundColor: 'rgba(60, 60, 80, 0.1)'
    }
  ];
  this.xw.endDocument();
  this.overviewXML= beautify(this.xw.toString());
   // console.log(beautify(this.xw.toString()));
  console.error(this.overviewArray)
}

calPrice({ year, costElement, amount, units = 1,market }: { year: number; costElement: any; amount: number; units?: number;market : string }):any {
  console.log("    calculatoin price_new");
  console.log("    year",year);
  console.log("    costElement",costElement);
  console.log("    amount/assets",amount);
  console.log("    costElement.price",costElement.price);
  
  
  let cost = amount * costElement.price

  console.log("    Initial Cost",cost);
  
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
    console.log("    after applaying max cost per unit",cost);
  }
  
  
  
  console.log("    number of units(transactions) to applay cost to",units);
  this.xw.writeAttribute('Number_of_units', units);
  cost = cost * units
  this.addElementToXML('Cost_amount', {'amount':cost},true);
  console.log("    after applaying number of transaction",cost);
  
  this.record(this.overviewArray[year+market ],costElement.costName,cost)
  this.record(this.overviewArray[year+market ],"Cat_"+costElement.costType2,cost)
  this.record(this.overviewArray[market + "_total"],costElement.costName,cost)
  this.record(this.overviewArray[market + "_total"],"Cat_"+costElement.costType2,cost)
  
  //console.error(" mmmmm",this.overviewArray[market + "_total"])   
  //console.error(" mmmmm",costElement.costName)       
  
  return {"year":year,"amount":cost,"costName":costElement.costName, "costType":costElement.costType2}
}




calall(year,deposit,cumDeposit,cumAssets,market){
  const logging = true

 
        
  
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
          //this.console_log("XXXXX allocation" + assetAllocation[0],logging,5,"M")
          this.xw.writeAttribute('Instrument_name', costElement.instrumentName);
          //this.xw.writeAttribute('Asset_allocation_fraction', assetAllocation[0].percentage);
          
          let iNumberOfTransactionsInThisInstrument = this.transactions * assetAllocation[0].percentage;
          let iSingleOrderTransactionAmountInThisInstrument = (this.productOptions.transactionCostPercentage * assetAllocation[0].percentage * cumAssets ) / this.transactions 

          this.allCosts.push(this.calPrice({ year, costElement, amount: iSingleOrderTransactionAmountInThisInstrument, units: iNumberOfTransactionsInThisInstrument,market }));
          
          
          console.log("XXXXX allCost", this.allCosts)
        } else {
        //  this.console_log("error no asset allocation found for Instrument cost element:" + costElement.instrumentName ,logging,5,"M")
        }
        console.log("XXXXX assetallocation for (",costElement.instrumentName,") ==>", assetAllocation)


        


        
        break;
      case "Product Related":
        console.log("XXXXX Product Releated Cost",costElement)
        console.log("XXXXX Cost Name",costElement.costName)
        if (typeof assetAllocation !== 'undefined' ) {
        //  this.console_log("XXXXX allocation" + assetAllocation[0],logging,5,"M")

          let iamount =  assetAllocation[0].percentage * cumAssets 
          this.xw.writeAttribute('Instrument_name', costElement.instrumentName);
          this.xw.writeAttribute('Asset_allocation', assetAllocation[0].percentage);
          this.allCosts.push(this.calPrice({ year, costElement, amount: iamount, units: 1 ,market}));
          console.log("XXXXX allCost", this.allCosts)
          
          
        } else {
          //.console_log("error no asset allocation found for Instrument cost element:" + costElement.instrumentName ,logging,5,"M")
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
        this.calPrice({ year, costElement, amount: partInThisLevel, units: 1 ,market})
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
 // this.xw.endElement()  // end market
 // this.xw.endElement()  // year

}



  year(i: number) {

    return this.startyear + i;
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

  


  
}
//// hi

