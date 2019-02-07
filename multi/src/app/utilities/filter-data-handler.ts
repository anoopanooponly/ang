/**********************************************************************************
* File Name   :   FilterDataHandler.ts
* Description :   This is a singleton class which implements the logic for handling filter Data 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 10-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { FilterData } from './../model/filter-data';
import * as _ from 'lodash';

export class FilterDataHandler {
    private static _instance: FilterDataHandler = new FilterDataHandler();
    private filterDataList = new Array<FilterData>();
    private organization="";
    public filterQuery = "";

    /**
     * Creates an instance of FilterDataHandler.
     * 
     * @memberOf FilterDataHandler
     */
    constructor() {
        if (FilterDataHandler._instance) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        FilterDataHandler._instance = this;
    }

    /**
     * 
     * 
     * @static
     * @returns {FilterDataHandler} 
     * 
     * @memberOf FilterDataHandler
     */
    public static getInstance(): FilterDataHandler {
        return FilterDataHandler._instance;
    }

    /**
     * 
     * 
     * @param {string} org 
     * 
     * @memberOf FilterDataHandler
     */
    public setOrganization(org: string){
        if (org=="-1"){
        this.organization="";
        }else{
         this.organization= "&org_id="+org;
        }
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf FilterDataHandler
     */
    public getOrganization(){
        return this.organization;
    }

    /**
     * 
     * 
     * @param {Array<FilterData>} filterList 
     * 
     * @memberOf FilterDataHandler
     */
    public setFilterData(filterList: Array<FilterData>) {
        this.filterQuery = "";
        for (let i = 0; i < filterList.length; i++) {
            this.filterQuery = this.filterQuery + "&site_tag_id=" + filterList[i].filterId;
        }
        this.filterDataList = filterList;
    }

    /**
     * 
     * 
     * 
     * @memberOf FilterDataHandler
     */
    public clearFilter() {
        this.filterQuery = "";
    }

    /**
     * 
     * 
     * @param {*} filterList 
     * @returns 
     * 
     * @memberOf FilterDataHandler
     */
    public getSiteCountsForFilters(filterList: any) {
        if (filterList == null) {
            return null;
        }

        let filterContainer = new Array<Array<string>>();
        for (let i = 0; i < filterList.length; i++) {
            if (Number(filterList[i].siteCount) < 1) {
                return 0;
            }
            let filterIdList = new Array<string>();
            filterIdList = filterList[i].siteIdList;
            filterContainer.push(filterIdList);
        }
        // return _.intersection(filterList).length;
        let selectedIntersection = _.intersection.apply(_, filterContainer);
        return selectedIntersection.length;
    }

}
