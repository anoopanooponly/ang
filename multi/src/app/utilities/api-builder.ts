/**********************************************************************************
* File Name   :   ApiBuilder.ts
* Description :   This class implements API generation logic
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 10-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { FilterDataHandler } from './filter-data-handler';
export class ApiBuilder {

	private static _instance: ApiBuilder = new ApiBuilder();
	public RET_SUCCESS: number = 200;
	public heatmapOn: boolean;
	private SERVER_IP: string;
	private LOGIN: string;
    public filterDataHandler;

	/**
	 * Creates an instance of ApiBuilder.
	 * 
	 * @memberOf ApiBuilder
	 */
	constructor() {
		// this.heatmapOn = false;
		if (ApiBuilder._instance) {
			throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
		}
		ApiBuilder._instance = this;
		 this.filterDataHandler = FilterDataHandler.getInstance();
	}

	/**
	 * 
	 * 
	 * @static
	 * @returns {ApiBuilder} 
	 * 
	 * @memberOf ApiBuilder
	 */
	public static getInstance(): ApiBuilder {
		return ApiBuilder._instance;
	}
	/**
	* Return Authentication URL 
	* 
	* @param username   : User Name.
	* @param password   : User Password 
	* @return authToken : Authentication Tocken
	*/
	getAuthenticationURL() {
		return "api/authenticate?include=role,privileges,access_permissions,access_permission_name";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getViewsURL() {
		return "api/views?order_by=name&include=org&include_empty=false&order=asc&include_empty=false&order=asc"+
		(this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getStoreURL() {
		return "api/sites?order_by=name&include_devices_empty=false&include=gateways,address,contact&is_assigned_gateway=true&order=asc"+ 
		(this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getForgotPasswordURL() {
		return "api/password_reset";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getStoreCameraListURL() {
		return "api/devices?site_id=SITE_ID&type=camera&order_by=name&is_assigned_gateway=true&order=asc&include=assigned_gateway,site,healthy"
		+ (this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '');
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getViewCameraListURL() {
		return "api/devices?view_id=VIEW_ID&type=camera&order_by=name&is_assigned_gateway=true&order=asc&include=assigned_gateway,site,healthy"+
		(this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '');
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getLogoutURL() {
		return "api/logout";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getHeatMapGenericUrl() {

		return "api/devices/DEVICE_ID/heat_map?RESOLUTION&min_motion=30&max_motion=80&time=START_TIME&duration_type=DURATION_TYPE&motion_type=MOTION_TYPE&duration_time=DURATION_TIME&thumbnail_time=THUMB_NAIL_TIME"+
		(this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '');

	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getMotionEventsGenericURL() {
		return "api/devices/DEVICE_ID/motion_events?start_time=START_TIME&end_time=END_TIME&activity_min=50&activity_max=10000&gap_min=GAP_MIN&distribution=4294967295&per_page=10000&page=0&period_min=1000";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getRecordingEventsGenericURL() {
		return "api/devices/DEVICE_ID/contents?per_page=10000&start_time=START_TIME&end_time=END_TIME";
	}
	
	/**
	 * 
	 * 
	 * @param {*} Visibility 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getLibraryDataGenericURL(Visibility :any) {

		let genericURL = "api/clips?order_by=start_time&order=desc&with_page_count=true&with_item_count=true&page=PAGE_NO&per_page=PER_PAGE&exclude_status=pending_deletion&type=manual&include=assigned_gateway,site,device"+
		(this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
	    return genericURL+(Visibility && Visibility != 'undefined' ?  Visibility: '');
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getExportingEventsGenericURL() {

		return "api/exports?order_by=created_time&order=asc&device_id=DEVICE_ID&with_page_count=true&with_item_count=true&page=0&per_page=100&start_time=START_TIME&end_time=END_TIME&status=complete&type=manual&include=site";
	}


	getOrgListUrlForSuperUser() {
		return "api/orgs";
	}

	//static MEDIA_SERVER	="MEDIA_SERVER_IP":string;
	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getPlayerThumbnailGenericURLforLowRes() {
		return "api/devices/DEVICE_UID/thumbnail?time=RFCTIME&width=120&height=80&qmin=8&qmax=8";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getPlayerThumbnailGenericURLforHighRes() {
		return "api/devices/DEVICE_UID/thumbnail?time=RFCTIME&width=1280&height=720&qmin=8&qmax=10";
	}

	/**
	 * 
	 * 
	 * @param {*} Visibility 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getLibraryDatabyStoreGenericURL(Visibility :any) {
		let genericURL = "api/clips?order_by=created_time&order=desc&with_page_count=true&with_item_count=true&page=PAGE_NO&per_page=PER_PAGE&exclude_status=pending_deletion&type=manual&site_id=SITE_ID&include=device,site"+(this.filterDataHandler.filterQuery != null  ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
		return genericURL+ (Visibility && Visibility != 'undefined' ?  Visibility: '');
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getShiftsAPI()
	{
		return "api/settings/times_for_review";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getCreateClipEventsGenericURL() {
		return "api/clips";
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getHighlightsReportRulesGenericURL() {
		let genericURL = "api/report_rules?&order_by=name&order=asc&include_report_items_empty=false/report_rules?&order_by=name&order=asc&include_report_items_empty=false"
		+(this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getHighlightsReportRulesPerReelGenericURL() {
		let genericURL = "api/report_items?report_rule_id=REPORT_RULE_ID&include=gateway&order_by=start_time&order=desc&export_status=complete&with_page_count=true&page=PAGE_NO&per_page=PER_PAGE"
		+(this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getHighlightsReportRulesPerStoreURL() {
		let genericURL = "api/report_items?site_id=SITE_ID&include=gateway&order_by=start_time&order=desc&export_status=complete&with_page_count=true&page=PAGE_NO&per_page=PER_PAGE"+(this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getHighlightsReportbyStartTimeURL() {
		let genericURL = "api/report_items?order_by=start_time&order=desc&export_status=complete&with_page_count=true&page=PAGE_NO&per_page=PER_PAGE"+ (this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '')+(this.filterDataHandler.getOrganization() != null  ? this.filterDataHandler.getOrganization() : '');
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getYamsInfoURL(){
		let genericURL ="https://yams-dev.multisight.com/server/stats";
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getLocalGatewayGenericURL(){
		let genericURL ="https://GATEWAY_IP/hermes/gateway/id";
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getPeopleCountingGenericURLForAllStores(){
		//let genericURL ="api/object_counts?count_type=COUNT_TYPE&local_start_time=START_TIME&local_end_time=END_TIME&site_id=SITE_ID&with_item_count=true&include=details";
		let genericURL ="api/object_counts?count_type=COUNT_TYPE&local_start_time=START_TIME&local_end_time=END_TIME&with_item_count=true&include=details&order_by=local_start_time&order=asc"	+(this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '');
		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getPeopleCountingGenericURLPerStore(){
		let genericURL ="api/object_counts?count_type=COUNT_TYPE&local_start_time=START_TIME&local_end_time=END_TIME&site_id=SITE_ID&with_item_count=true&include=details&&order_by=local_start_time&order=asc"+(this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '');

		return genericURL;
	}

	/**
	 * 
	 * 
	 * @returns 
	 * 
	 * @memberOf ApiBuilder
	 */
	getPeopleCountingDownloadURL(){
		let genericURL = "api/object_counts?format=csv&count_type=COUNT_TYPE&local_start_time=START_TIME&local_end_time=END_TIME&order_by=local_start_time&order=asc"+(this.filterDataHandler.filterQuery !== null ? this.filterDataHandler.filterQuery : '');
		return genericURL;
	}
	static LOGIN = "api/authenticate";
	// static RESET_PASSWORD = SERVER_IP+"/password_reset":string;
	//  VIEWS_LIST = SERVER_IP+"/views?order_by=name&include=org&include_empty=false&order=asc&include_empty=false";
	//  SITE_TAGS=SERVER_IP+"/site_tags?order_by=name&include=sites_with_devices_count,sites";
	//  DEVICES_LIST = SERVER_IP+"/devices?order_by=name&order=asc";
	//  STORES_LIST = SERVER_IP+"/sites?order_by=name&exclude_empty=true&include=gateways,address,contact&is_assigned_gateway=true&order=asc";
	//  CAMERAS_LIST = SERVER_IP+"/devices?site_id=SITE_ID&view_id=VIEW_ID&type=camera&order_by=name&is_assigned_gateway=true&order=asc&include=assigned_gateway,site,healthy";
	//  EXPORT_CLIP = SERVER_IP+"/exports";
	//  TIME_TO_REVIEW_LIST = SERVER_IP+"/settings/times_for_review";
	//  CLOUD_SERVER_LIST = MEDIA_SERVER;
	//  CREATE_SESSION = SERVER_IP+"/sessions";
	//  CREATE_HLS = "URI/playlist/index.m3u8?start_time=START_TIME&data_source_id=DATA_SOURCE_ID&max_bandwidth=UPLOAD_KBPS&token=TOKEN_ID&speed=SPEED";
	//  DELETE_SESSION = SERVER_IP+"/session/SESSION_ID";


	//  LIBRARY_LIST_GBSTORES = SERVER_IP+"/exports?order_by=created_time&order=desc&with_page_count=true&with_item_count=true&page=0&per_page=9&exclude_status=pending_deletion&type=manual&site_id=SITE_ID&include=device,site"; //SERVER_IP+"/exports?order_by=created_time&order=desc&assigned_gateway_id=GATEWAY_ID&with_page_count=true&with_item_count=true&page=0&per_page=9&exclude_status=pending_deletion";

	//  LIBRARY_GBSTART 		= SERVER_IP+"/exports?order_by=start_time&order=desc&with_page_count=true&with_item_count=true&page=0&per_page=50&exclude_status=pending_deletion&type=manual&include=site";
	//  LIBRARY_GBDATE = SERVER_IP+"/exports?order_by=created_time&order=desc&with_page_count=true&with_item_count=true&page=0&per_page=50&exclude_status=pending_deletion&type=manual&include=site";

	//  LIBRARY_GBSTART_MORE = SERVER_IP+"/exports?order_by=created_time&order=desc&site_id=SITE_ID&with_page_count=true&with_item_count=true&page=0&per_page=50&exclude_status=pending_deletion&type=manual&include=site";
	//  EXPORTS_IN_TIME = SERVER_IP+"/exports?order_by=created_time&order=asc&device_id=DEVICE_ID&with_page_count=true&with_item_count=true&page=0&per_page=100&start_time=START_TIME&end_time=END_TIME&status=complete&type=manual&include=site";
	//  EXPORT_STATUS = SERVER_IP+"/exports/EXPORT_ID";

	//  MOTION_EVENT = SERVER_IP+"/devices/DEVICE_ID/motion_events?start_time=START_TIME&end_time=END_TIME&activity_min=50&activity_max=10000&gap_min=GAP_MIN&distribution=4294967295&per_page=10000&page=0&period_min=1000";
	//  VIDEO_LIST = SERVER_IP+"/devices/DEVICE_ID/contents?per_page=10000&start_time=START_TIME&end_time=END_TIME";
	//  LOCAL_GATEWAY = "http://GATEWAY_IP/hermes/gateway/id";

	//  HIGHLIGHTS = SERVER_IP+"/reports?include=report_rule,sites&with_page_count=true&page=0&per_page=50&order_by=created_time&order=desc";
	//  REPORT_RULES=SERVER_IP+"/report_rules?order_by=created_time&include_empty=false&include_report_items_empty=false";///report_rules?include_empty=false&include_report_items_empty=false 

	//  REPORTS	=SERVER_IP+"/report_items?report_id=REPORT_ID&include=gateway&order_by=start_time&order=desc&export_status=complete&with_page_count=true";//&order_by=start_time&order=desc&export_status=complete&with_page_count=true
	//  DEVICE_API = SERVER_IP+"/devices/";
	//  EXPORTS_VIDEO = SERVER_IP+"/exports/";
	//  SESSIONS = SERVER_IP+"/sessions/";

	// REFRESH_BANDWIDTH	="YAMSIP/sessions/SESSION_ID/stats";

	//public static String HEATMAP_IMAGE=SERVER_IP+"/devices/DEVICE_ID/heat_map?RESOLUTION&min_motion=30&max_motion=80&time=START_TIME&duration_type=DURATION_TYPE&motion_type=MOTION_TYPE&duration_time=DURATION_TIME&thumbnail_time=THUMB_NAIL_TIME";

	rebuildALLAPIS() {
		//RESET_PASSWORD = SERVER_IP+"/password_reset";
		// VIEWS_LIST = SERVER_IP+"/views?order_by=name&include=org&include_empty=false&order=asc&include_empty=false";
		// DEVICES_LIST = SERVER_IP+"/devices?order_by=name&order=asc";
		// STORES_LIST = SERVER_IP+"/sites?order_by=name&exclude_empty=true&include=gateways,address,contact&is_assigned_gateway=true&order=asc";
		// CAMERAS_LIST = SERVER_IP+"/devices?site_id=SITE_ID&view_id=VIEW_ID&type=camera&order_by=name&is_assigned_gateway=true&order=asc&include=assigned_gateway,site,device,healthy";
		// EXPORT_CLIP = SERVER_IP+"/exports";
		// TIME_TO_REVIEW_LIST = SERVER_IP+"/settings/times_for_review";
		// CLOUD_SERVER_LIST = MEDIA_SERVER;
		// CREATE_SESSION = SERVER_IP+"/sessions";
		// CREATE_HLS = "URI/playlist/index.m3u8?start_time=START_TIME&data_source_id=DATA_SOURCE_ID&token=TOKEN_ID&max_bandwidth=UPLOAD_KBPS&speed=SPEED";
		// DELETE_SESSION = SERVER_IP+"/session/SESSION_ID";

		//  LIBRARY_LIST_GBSTORES = SERVER_IP+"/exports?order_by=created_time&order=desc&with_page_count=true&with_item_count=true&page=0&per_page=9&exclude_status=pending_deletion&type=manual&site_id=SITE_ID&include=device,site";
		// //LIBRARY_LIST_GBSTORES = SERVER_IP+"/exports?order_by=created_time&order=desc&assigned_gateway_id=GATEWAY_ID&with_page_count=true&with_item_count=true&page=0&per_page=9&exclude_status=pending_deletion&include=assigned_gateway,site,device";
		// LIBRARY_GBSTART = SERVER_IP+"/exports?order_by=start_time&order=desc&with_page_count=true&with_item_count=true&page=0&per_page=50&exclude_status=pending_deletion&type=manual&include=assigned_gateway,site,device";
		// LIBRARY_GBDATE = SERVER_IP+"/exports?order_by=created_time&order=desc&with_page_count=true&with_item_count=true&page=0&per_page=50&exclude_status=pending_deletion&type=manual&include=assigned_gateway,site,device";

		// LIBRARY_GBSTART_MORE = SERVER_IP+"/exports?order_by=created_time&order=desc&site_id=SITE_ID&with_page_count=true&with_item_count=true&page=0&per_page=50&exclude_status=pending_deletion&type=manual&include=assigned_gateway,site,device";
		// MOTION_EVENT = SERVER_IP+"/devices/DEVICE_ID/motion_events?start_time=START_TIME&end_time=END_TIME&activity_min=50&activity_max=10000&gap_min=GAP_MIN&distribution=4294967295&per_page=10000&page=0&period_min=1000";
		// EXPORTS_IN_TIME = SERVER_IP+"/exports?order_by=created_time&order=asc&device_id=DEVICE_ID&with_page_count=true&with_item_count=true&page=0&per_page=100&start_time=START_TIME&end_time=END_TIME&status=complete&type=manual&include=assigned_gateway,site,device";
		// VIDEO_LIST = SERVER_IP+"/devices/DEVICE_ID/contents?per_page=10000&start_time=START_TIME&end_time=END_TIME";
		// EXPORT_STATUS = SERVER_IP+"/exports/EXPORT_ID";
		// LOCAL_GATEWAY = "http://GATEWAY_IP/hermes/gateway/id";
		// HIGHLIGHTS = SERVER_IP+"/reports?include=report_rule,sites&with_page_count=true&page=0&per_page=50&order_by=created_time&order=desc";
		// REPORTS	=SERVER_IP+"/report_items?report_id=REPORT_ID&include=gateway&order_by=start_time&order=desc&export_status=complete&with_page_count=true";//SERVER_IP+"/report_items?report_id=REPORT_ID&include=gateway&order_by=start_time&order=desc";

		// DEVICE_API = SERVER_IP+"/devices/";
		// EXPORTS_VIDEO = SERVER_IP+"/exports/";
		// SESSIONS = SERVER_IP+"/sessions/";

		// REFRESH_BANDWIDTH	="YAMSIP/sessions/SESSION_ID/stats";
		// REPORT_RULES=SERVER_IP+"/report_rules?order_by=created_time&includ;e_empty=false&include_report_items_empty=false";//SERVER_IP+"/report_rules?order_by=created_time";

		// HEATMAP_IMAGE=SERVER_IP+"/devices/DEVICE_ID/heat_map?RESOLUTION&min_motion=30&max_motion=80&time=START_TIME&duration_type=DURATION_TYPE&motion_type=MOTION_TYPE&duration_time=DURATION_TIME&thumbnail_time=THUMB_NAIL_TIME";

		// SITE_TAGS=SERVER_IP+"/site_tags?order_by=name&include=sites_with_devices_count,sites";
	}


}