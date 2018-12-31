import { Component, OnInit , Input} from '@angular/core';
import { ConfigService } from '../iot.service';
import { Options } from 'ng5-slider';


// to do comments
// to do testing
// to do load cost for multiple risk levels
// to do load cost for multiple products
// to do remove un-used variables 

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  providers:[ConfigService],
  
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {

  @Input('product') product : string;

  value: number = 100;
  //productCode = "ZBB";
  oneTimeDepositStepRange: number[] = this.createStepRange([
    {rangeLow:0,rangeHigh:250,rangeStep:10},
    {rangeLow:250,rangeHigh:1000,rangeStep:50},
    {rangeLow:1000,rangeHigh:5000,rangeStep:200},
    {rangeLow:5000,rangeHigh:10000,rangeStep:1000},
    {rangeLow:10000,rangeHigh:100000,rangeStep:10000},

  ]);
  recurringDepositStepRange: number[] = this.createStepRange([
    {rangeLow:0,rangeHigh:250,rangeStep:10},
    {rangeLow:250,rangeHigh:1000,rangeStep:50},
    {rangeLow:1000,rangeHigh:5000,rangeStep:200}    
  ]);
  
  periodOptions: Options =  {
    minLimit: 2,
    floor: 0,
    ceil: 42,
    showTicks: false,
    keyboardSupport: false,
    showSelectionBar: false
  };

  transactionOptions: Options =  {
    floor: 0,
    ceil: 300,
    showTicks: false,
    keyboardSupport: false,
    showSelectionBar: false
  };

  oneTimeDepositOptions: Options =  {
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



  riskLevelOptions: Options =  {
    floor: 1,
    ceil: 6,
    step: 1,
    minLimit: 1,
    showTicks: false,
    showTicksValues: true,
    showSelectionBar: true,
    keyboardSupport: false,
    stepsArray: [
      {value: 1, legend: 'Zeer defensief'},
      {value: 2, legend: 'Defensief'},
      {value: 3, legend: 'Matig defensief'},
      {value: 4, legend: 'Matig offensief'},
      {value: 5, legend: 'Offensief'},
      {value: 6, legend: 'Zeer offensief'}
    ],
    
    selectionBarGradient: {
      from: 'green',
      to: 'red'
    }

  };


  recurringDepositOptions: Options =  {
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

  

  createStepRange(rangeList : Array<{rangeLow,rangeHigh,rangeStep}>): number[] {
    // console.log(rangeList)
    
    const steps: number[] = [];
    rangeList.forEach(range => {
      for (let i: number = range.rangeLow; i <= range.rangeHigh; i = i + range.rangeStep) {
        steps.push( i);
      }
    });
    
    
    
   
    return steps;
  }



  
  public period: number = 2;
  public riskLevel: number = 3;
  priceJson: string;
  portfolioJson : string;
  public variableServiceFeePercentage : number; 
  public fixedMonthlyServiceFee : number;
  public oneTimeDeposit = 100;
  public recurringDeposit = 100;
  public transactions = 10;
  public discountLevels = [];
  public tax : number;
  public currencyCost : number;
  assetAllocationList = [];
  startyear : number = 2018
  public portfolio: any;
  priceList: any;
  


  constructor(private ConfigService : ConfigService ) { 
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
      this.priceList = data.priceList;
      this.tax = data.tax;
      this.currencyCost = data.currency;
      this.discountLevels = data.discountLevels;
      this.variableServiceFeePercentage = data.variableServiceFeePercentage;
      this.fixedMonthlyServiceFee = data.fixedMonthlyServiceFee;
      console.log("receiving pricelist");
      console.log(this.priceList );
      this.recalculate();
    });
    
   
  }

  recalculate(){
    //console.log("recalculate")
    this.portfolio = []
    let iPastAsset = 0;
    let today = new Date();
    for (let index = 0 ; index < this.period; index++) {
      let iyear = this.year(index);
      let iAsset = this.asset(index,iPastAsset);
      let iCumAsset = this.cumAsset(index-1,iAsset);
      let iFixexServiceFee = this.fixexServiceFee(today,iyear);

      let iVariableServiceFee = this.variableServiceFee(iCumAsset);
      
      let iTxCost = this.txCost(iAsset);
      let iTxDiscount = this.txDiscount(iTxCost);
      let iTax = this.tax * iAsset;
      let iCurrencyCost = this.currencyCost * iAsset;
      this.portfolio.push( {
        "year": iyear,
        "asset":iAsset,
        "cumAsset": iCumAsset,
        "fixedServiceFee": iFixexServiceFee,
        "variableServiceFee": iVariableServiceFee,
        "txCost" : iTxCost,
        "tax" : iTax,
        "currencyCost" : iCurrencyCost,
        "txDiscount" : iTxDiscount
      });
      iPastAsset = iAsset;
    }
  }
  year(i: number){
   
    return this.startyear + i;
  }

  asset (i: number,iStartAsset){
    let asset = 0;
    if (i==0) 
       asset = this.oneTimeDeposit;
    asset +=  this.recurringDeposit;  // multiply by * 12 is period is one month
    return  asset; 
  }

  cumAsset (i,a) {
    let asset = a;
    if (i>=0)
      asset += this.portfolio[i].cumAsset;

    return asset;
  }
  
  fixexServiceFee(d:Date,year) {
    //console.log(d.getFullYear());
    let ifixexServiceFee = 0;

    if (d.getFullYear() == year) {
      ifixexServiceFee = (12 - d.getMonth()) * this.fixedMonthlyServiceFee;
    } else {
      ifixexServiceFee = 12 * this.fixedMonthlyServiceFee;
    }
    return ifixexServiceFee;
  }
  variableServiceFee (totalAsset:number) {
    return (totalAsset * this.variableServiceFeePercentage);
  }

  txDiscount(txCost) {
    let iTxDiscount = 0;

    if (this.discountLevels) {
      for (let index = 0; index < this.discountLevels.length; index++) {
        let iDiscountLevel = this.discountLevels[index];
        
        if (txCost > iDiscountLevel.lowerBand ) { // dicount applies
          if (txCost >  iDiscountLevel.upperBand) { //full discount applies
            
            iTxDiscount += (iDiscountLevel.upperBand - iDiscountLevel.lowerBand) * iDiscountLevel.variableDiscount;
            
          
            

          } else { //some discount applies
            iTxDiscount +=  (txCost - iDiscountLevel.lowerBand) * iDiscountLevel.variableDiscount;
            

          }
        }

        
      
      }
    }
    return iTxDiscount;
  }

  txCost (asset : number) {
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
      
      console.log(instrumentPrices);
      if (instrumentPrices) {
        //console.log("yes! instrumentPrices")
        let instrumentPrice = instrumentPrices[0];
        //console.log(instrumentPrice)
        switch (instrumentPrice.costType) {
          case "fixed" :
            //console.log("fixed cost <===");
            //console.log(instrumentPrice.cost + " * " + assetAllocation.percentage + " * " +  this.transactions);
            // only price transactions if assest <> 0
            if (asset > 0) 
                icost += instrumentPrice.cost * assetAllocation.percentage * this.transactions;
            else
                icost += 0;
            break;
          case "variable" :
            //console.log("variable cost <===");
            //console.log(this.transactions);
            
            let iAssetcost = asset /  (this.transactions  * assetAllocation.percentage)  * instrumentPrice.costPercentage ;
             //console.log(iAssetcost + " = " + instrumentPrice.minCost + " < " + asset + " / (" + this.transactions  + " * " + assetAllocation.percentage + ")  * " +  instrumentPrice.costPercentage );
            //console.log (" min (" +instrumentPrice.minCost +")" );
            //console.log (" max (" +instrumentPrice.maxCost +")" );
             if (iAssetcost != 0) {
              iAssetcost = Math.max(iAssetcost,instrumentPrice.minCost)
              iAssetcost = Math.min(iAssetcost,instrumentPrice.maxCost)
            }
            icost += iAssetcost * (this.transactions  * assetAllocation.percentage);
            //console.log(icost);
            break;
          

        }
      }
      
      
    }
    return icost;
  }

  


}
