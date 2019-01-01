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

  @Input('product') product: string;


  goodMarketFactor: number = 1.1;
  nutralMarketFactor: number = 1;
  badMarketFactor: number = 0.95;

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
    ceil: 300,
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
    ceil: 6,
    step: 1,
    minLimit: 1,
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
  public riskLevel: number = 3;
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
  startyear: number = 2018
  public portfolio: any;
  priceList: any;

  public totalCumDeposit: number;
  public totalnutralMarketAssets: number;
  public totalBadMarketAssets: number;
  public totalGoodMarketAssets: number;
  public totalnutralMarketCosts: number;
  public totalBadMarketCosts: number;
  public totalGoodMarketCosts: number;




  constructor(private ConfigService: ConfigService) {
    console.log("start constructor");



  }

  ngOnInit() {
    console.log("start ngOnInit");
    console.log(this.product);

    //this.productCode = this.product;
    this.ConfigService.getJSON("./assets/portfoliodivision.json").subscribe(data => {
      this.assetAllocationList = data.portfolioDevision[this.product];
      this.portfolioJson = data;
      console.log("receiving assetAllocationList");
      console.log(this.assetAllocationList);
    });
    this.ConfigService.getJSON("./assets/tx_prices.json").subscribe(data => {
      this.priceJson = data;
      this.priceList = data[this.product].priceList;
      this.tax = data[this.product].tax;
      this.currencyCost = data[this.product].currency;
      this.discountLevels = data[this.product].discountLevels;
      this.variableServiceFeePercentage = data[this.product].variableServiceFeePercentage;
      this.fixedMonthlyServiceFee = data[this.product].fixedMonthlyServiceFee;
      console.log("receiving pricelist");
      console.log(this.priceList);
      this.recalculate();
    });


  }

  recalculate() {
    //console.log("recalculate")
    this.portfolio = []
    let iPastAsset = 0;
    let iDeposit = 0;
    let iPastDeposit = 0;
    let iCumDeposit = 0;
    
    let iGoodMarketAssets = 0;
    let iNutralMarketAssets = 0;
    let iBadmarketAssets = 0;

    let iTotalBadMarketCosts = 0;
    let iTotalNutrakMarketCosts = 0;
    let iTotalGoodMarketCosts = 0;

    let iBadMarketVariableServiceFee = 0;
    let iNutralMarketVariableServiceFee = 0;
    let iGoodMarketVariableServiceFee= 0;

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
      let iyear = this.year(index);
      
      let iDeposit = this.deposit(index, iPastDeposit);
      let iCumDeposit = this.cumDeposit(index - 1, iDeposit);

      iGoodMarketAssets += iDeposit;
      iNutralMarketAssets += iDeposit;
      iBadmarketAssets += iDeposit;

      iBadmarketAssets = iBadmarketAssets * this.badMarketFactor;
      iNutralMarketAssets = iNutralMarketAssets * this.nutralMarketFactor;
      iGoodMarketAssets = iGoodMarketAssets * this.goodMarketFactor;
      
      
      iBadMarketVariableServiceFee =  + this.variableServiceFee(iBadmarketAssets);
      iNutralMarketVariableServiceFee = this.variableServiceFee(iNutralMarketAssets);
      iGoodMarketVariableServiceFee =  this.variableServiceFee(iGoodMarketAssets);
      

      iCumBadMarketVariableServiceFee +=  iBadMarketVariableServiceFee;
      iCumNutralMarketVariableServiceFee += iNutralMarketVariableServiceFee;
      iCumGoodMarketVariableServiceFee +=  iGoodMarketVariableServiceFee;
      
      let iFixexServiceFee = this.fixexServiceFee(today, iyear);

      
      let iTxCost = this.txCost(iDeposit);
      let iTxDiscount = this.txDiscount(iTxCost);
      let iTax = this.tax * iDeposit;
      let iCurrencyCost = this.currencyCost * iDeposit;
      let iTotalFixedCost = + iTxCost - iTxDiscount + iCurrencyCost +  iFixexServiceFee + iTax;

      iTotalBadMarketCost =  iBadMarketVariableServiceFee + iTotalFixedCost;
      iTotalNutralMarketCost =  iNutralMarketVariableServiceFee + iTotalFixedCost;
      iTotalGoodMarketCost =  iGoodMarketVariableServiceFee + iTotalFixedCost;

      iCumTotalBadMarketCost += iTotalBadMarketCost;
      iCumTotalNutralMarketCost += iTotalNutralMarketCost;
      iCumTotalGoodMarketCost += iTotalGoodMarketCost;
    


      this.portfolio.push({
        "year": iyear,
        "deposit": iDeposit,
        "cumDeposit": iCumDeposit,
        "badMarketAssets": iBadmarketAssets,
        "nutralMarketAssets": iNutralMarketAssets,
        "goodMarketAssets": iGoodMarketAssets,
        "fixedServiceFee": iFixexServiceFee,
        
        "badMarketVariableServiceFee": iBadMarketVariableServiceFee,
        "nutralMarketVariableServiceFee" : iNutralMarketVariableServiceFee,
        "goodMarketVariableServiceFee" : iGoodMarketVariableServiceFee,
        
        "cumBadMarketVariableServiceFee" : iCumBadMarketVariableServiceFee,
        "cumNutralMarketVariableServiceFee" : iCumNutralMarketVariableServiceFee,
        "cumGoodMarketVariableServiceFee" : iCumGoodMarketVariableServiceFee,

        "totalBadMarketCost" : iTotalBadMarketCost,
        "totalNutralMarketCost" : iTotalNutralMarketCost,
        "totalGoodMarketCost" : iTotalGoodMarketCost,
        
        "cumTotalBadMarketCost" : iCumTotalBadMarketCost,
        "cumTotalNutralMarketCost" : iCumTotalNutralMarketCost,
        "cumTotalGoodMarketCost" : iCumTotalGoodMarketCost,
        

        "txCost": iTxCost,
        "tax": iTax,
        "currencyCost": iCurrencyCost,
        "txDiscount": iTxDiscount

      });
      iPastDeposit = iDeposit;

    }
    this.totalCumDeposit = iCumDeposit;
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

  txCost(asset: number) {
    //console.log("start txCost")
    let icost = 0;
    let itax = 0;
    let iDiscount = 0;
    //console.log(this.assetAllocationList);

    // def: instrument is a type of stock
    // def: asset is a stock that is part of a portfolio
    //
    // loop(1) through the list of asset allocations in the example portfolio based on product and risk level
    // for each element(instrument) in the example portfolio get the list off prices that are associated with that asses based on its name
    // loop 2 though that list of prices and calculat the price of the 
    // 
    for (let index = 0; index < this.assetAllocationList.length; index++) {

      const assetAllocation = this.assetAllocationList[index];

      const instrumentPrices = this.priceList.filter(instrument => instrument.instrumentName == assetAllocation.assetName);
      // make sure a instrument type can have more than one cost by handling an array as a result from the filte
      //console.log(assetAllocation.percentage);

      //console.log(instrumentPrices);
      if (instrumentPrices) {
        //console.log("yes! instrumentPrices")
        let instrumentPrice = instrumentPrices[0];
        //console.log(instrumentPrice)
        switch (instrumentPrice.costType) {
          case "fixed":
            //console.log("fixed cost <===");
            //console.log(instrumentPrice.cost + " * " + assetAllocation.percentage + " * " +  this.transactions);
            // only price transactions if assest <> 0
            if (asset > 0)
              icost += instrumentPrice.cost * assetAllocation.percentage * this.transactions;
            else
              icost += 0;
            break;
          case "variable":
            //console.log("variable cost <===");
            //console.log(this.transactions);

            let iAssetcost = asset / (this.transactions * assetAllocation.percentage) * instrumentPrice.costPercentage;
            //console.log(iAssetcost + " = " + instrumentPrice.minCost + " < " + asset + " / (" + this.transactions  + " * " + assetAllocation.percentage + ")  * " +  instrumentPrice.costPercentage );
            //console.log (" min (" +instrumentPrice.minCost +")" );
            //console.log (" max (" +instrumentPrice.maxCost +")" );
            if (iAssetcost != 0) {
              iAssetcost = Math.max(iAssetcost, instrumentPrice.minCost)
              iAssetcost = Math.min(iAssetcost, instrumentPrice.maxCost)
            }
            icost += iAssetcost * (this.transactions * assetAllocation.percentage);
            //console.log(icost);
            break;


        }
      }


    }
    return icost;
  }




}
