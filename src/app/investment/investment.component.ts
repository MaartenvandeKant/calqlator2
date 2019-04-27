import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../iot.service';
import { Options } from 'ng5-slider';



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
            stacked:true
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
    //console.log (market);
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



  riskLevelOptions: Options = {
    floor: 1,
    ceil: 2,
    step: 1,
    minLimit: 0,
    showTicks: false,
    showTicksValues: true,
    showSelectionBar: true,
    keyboardSupport: false,
    stepsArray: [
      { value: 1, legend: 'Zeer defensief' },
      { value: 2, legend: 'Defensief' },
      { value: 3, legend: 'Matig defensief' },
      { value: 4, legend: 'Matig offensief' },
      { value: 5, legend: 'Offensief' },
      { value: 6, legend: 'Zeer offensief' }
    ],

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
  public riskLevel: number = 1;
  priceJson: string;
  portfolioJson: string;
  public variableServiceFeePercentage: number;
  public fixedMonthlyServiceFee: number;
  public oneTimeDeposit = 100;
  public recurringDeposit = 100;
  public transactions = 10;
  public discountLevels = [];
  public tax: number;
  public currencyCost: number;

  assetAllocationList = [];
  assetAllocationListForAllRisks =[];
  startyear: number = 2018
  public portfolio: any;
  priceList: any;

  public cumTotalDeposit: number;
  public cumTotalNutralMarketAssets: number;
  public cumTotalBadMarketAssets: number;
  public cumTotalGoodMarketAssets: number;
  public cumTotalNutralMarketCosts: number;
  public cumTotalBadMarketCosts: number;
  public cumTotalGoodMarketCosts: number;

  public productOptions : any;

  public chart: any;



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
    
    this.ConfigService.getJSON("./assets/tx_prices.json").toPromise().then(data => {
      console.log("  Getting pricelist");
      this.priceJson = data;
      this.priceList = data[this.product].priceList;
      this.tax = data[this.product].tax;
      this.currencyCost = data[this.product].currency;
      this.discountLevels = data[this.product].discountLevels;
      this.variableServiceFeePercentage = data[this.product].variableServiceFeePercentage;
      this.fixedMonthlyServiceFee = data[this.product].fixedMonthlyServiceFee;
      
      console.log("  ",this.priceList);
      //this.recalculate();
    });

    
    this.ConfigService.getJSON("./assets/productoptions.json").toPromise().then(data => {
      console.log("  Getting product Options");
      this.productOptions = data.productOptions[this.product][0];
      console.log("  ",this.productOptions);
      this.recalculate();
    });


   
  }


  recalculate() {
    console.log(" ================ starting Cost calculation for", this.product)
    console.log(" ==============================================", this.product)
  
    this.portfolio = []
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



    let today = new Date();
    for (let index = 0; index < this.period; index++) {
      console.log("calculation for year", index)
      let iyear = this.year(index);
      console.log("calculation for year", iyear)

      let iDeposit = this.deposit(index, iPastDeposit);
      iCumDeposit = this.cumDeposit(index - 1, iDeposit);

      iBadMarketAssets += iDeposit;
      iNutralMarketAssets += iDeposit;
      iGoodMarketAssets += iDeposit;


      iBadMarketAssets = iBadMarketAssets + iBadMarketAssets * this.marketFactor('bad',this.riskLevel);
      iNutralMarketAssets = iNutralMarketAssets + iNutralMarketAssets * this.marketFactor('nutral', this.riskLevel);
      iGoodMarketAssets = iNutralMarketAssets +iGoodMarketAssets * this.marketFactor('good', this.riskLevel);


      iBadMarketVariableServiceFee = + this.variableServiceFee(iBadMarketAssets);
      iNutralMarketVariableServiceFee = this.variableServiceFee(iNutralMarketAssets);
      iGoodMarketVariableServiceFee = this.variableServiceFee(iGoodMarketAssets);


      iCumBadMarketVariableServiceFee += iBadMarketVariableServiceFee;
      iCumNutralMarketVariableServiceFee += iNutralMarketVariableServiceFee;
      iCumGoodMarketVariableServiceFee += iGoodMarketVariableServiceFee;

      console.log("calculation Fixed Services Fees");
      let iFixexServiceFee = this.fixexServiceFee(today, iyear);

      console.log("calculation transcations costs")
      let iTxCost = this.txCost(iCumDeposit);
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
        "tax": iTax,
        "currencyCost": iCurrencyCost,
        "txDiscount": iTxDiscount

      });
      iPastDeposit = iCumDeposit;
      this.cumTotalDeposit = iCumDeposit;

    }

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
    //console.log(d.getFullYear());
    let ifixexServiceFee = 0;

    if (d.getFullYear() == year) {
      ifixexServiceFee = (12 - d.getMonth()) * this.fixedMonthlyServiceFee;
    } else {
      ifixexServiceFee = 12 * this.fixedMonthlyServiceFee;
    }
    return ifixexServiceFee;
  }
  variableServiceFee(totalAsset: number) {
    return (totalAsset * this.variableServiceFeePercentage);
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

  txCost(totalAsset: number) {
    //console.log("start txCost")
    let icost = 0;
    let itax = 0;
    let iDiscount = 0;
    //console.log(this.assetAllocationList);


    //Lets get the right asset mix from the assetAllocationListForAllRisks
    //console.log("Risk associated asset allocation list");
    //console.log(this.assetAllocationListForAllRisks);


    console.log(" calulating transactions cost for product ",this.product)
    console.log(" finiding the applicable risk ralated assetallocations. Risk Level:",this.riskLevel)
    
    let iFoundRiskRelatedAssetAlocations = false;
    for (let r = 0; r < this.assetAllocationListForAllRisks.length; r++) {
      // this is a nasty way to make sure that at least one portfolio match the risk
      // if  it's the right one we stop the for loop
      this.assetAllocationList = this.assetAllocationListForAllRisks[r].assetAlocation;
      if (this.assetAllocationListForAllRisks[r].riskLevel == this.riskLevel)
      {
        console.log(" FoundRiskRelatedAssetAlocations found!!!");
        //console.log(this.assetAllocationListForAllRisks[r].riskLevel)
        //console.log(this.assetAllocationList);
        iFoundRiskRelatedAssetAlocations = true;
        break;
      }
      
      //console.log("asset allocation list =======");
      //console.log(this.riskLevel);
      //console.log(this.assetAllocationList);
    }
    if (!iFoundRiskRelatedAssetAlocations) {
      console.log(" No risk related asses allocations found !!!");
      console.log(" using default");
    }
    
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
      

      //console.log(instrumentPricesInfo);
      if (instrumentPricesInfo.length > 0) {
        //console.log("yes! instrumentPricesInfo")
        let instrumentPrice = instrumentPricesInfo[0];
        
        
        switch (instrumentPrice.costType) {
          case "fixed":
            console.log("     Cost type is Fixed");
            console.log("     Price", instrumentPrice.cost);
            
            console.log("     ",instrumentPrice.cost + " * " + assetAllocation.percentage + " * " +  this.transactions);
            // only price transactions if assest <> 0
            if (totalAsset > 0)
              icost += instrumentPrice.cost * assetAllocation.percentage * this.transactions;
            else
              icost += 0;
            break;

          case "variable":
             console.log("     Cost type is Variable");
             console.log("     Cost is ", instrumentPrice.costPercentage," of single order amount ");
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
            console.log ("        Variable price is ", instrumentPrice.costPercentage," of each order amount (",iSingleTransactionAmount,")");
            let iVariableOrderCost = instrumentPrice.costPercentage * iSingleTransactionAmount
            console.log ("        Variable price is ", iVariableOrderCost);

            let iStartingCost = 0;
            if (instrumentPrice.startingCost) {
              iStartingCost =instrumentPrice.startingCost;
              console.log("        It has a Staring Price of", instrumentPrice.startingCost);
              
            }

            let iSingleOrderCost = instrumentPrice.startingCost + iVariableOrderCost
            console.log ("        Single order Cost  ",iSingleOrderCost)


            console.log ("        Instrument Minimum Price is ",instrumentPrice.minCost)
            console.log ("        Instrument Maximum Price is ",instrumentPrice.maxCost)


            let iFinalSingleOrderCost = iSingleOrderCost
            
            iFinalSingleOrderCost = Math.max(iFinalSingleOrderCost, instrumentPrice.minCost)
            iFinalSingleOrderCost = Math.min(iFinalSingleOrderCost, instrumentPrice.maxCost)
            

            console.log ("        Final single order price is (including min,max) ", iFinalSingleOrderCost)
            
            let iTotalInstrumentCost = iFinalSingleOrderCost * iNumberOfTransactionsInThisInstrument
            console.log ("        Total order Cost in this instrument is ", iTotalInstrumentCost)
            console.log ("        (Single Order Cost (",iFinalSingleOrderCost,") * #Tx in this instrument (",iNumberOfTransactionsInThisInstrument,"))= ")
            console.log ("        Price ===> ", iTotalInstrumentCost)

            
            
            icost += iTotalInstrumentCost
            console.log ("      ====> Total Order cost cost of ",index + 1," out of ",this.assetAllocationList.length," instuments  ===> ", icost)
            //console.log(icost);
            console.log ("      =================================");
            break;


        }

      } else
      {
        console.log ("instrument",assetAllocation.assetName, " in portfolio not found, skipping this intrument")

      }


    }
    return icost;
  }




}
//// hi

