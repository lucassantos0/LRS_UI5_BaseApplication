/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/util/TypeUtil"],function(T){"use strict";var u=function(){};u.fetchAllAnnotations=function(m,e){var c=m.getMetaContext(e);return m.requestObject("@",c).then(function(a){return a;});};u.getAllCustomAggregates=function(a){var c={},A;for(var s in a){if(s.startsWith("@Org.OData.Aggregation.V1.CustomAggregate")){A=s.replace("@Org.OData.Aggregation.V1.CustomAggregate#","");var b=A.split("@");if(b.length==2){if(b[1]=="Org.OData.Aggregation.V1.ContextDefiningProperties"){c[b[0]].contextDefiningProperties=a[s];}if(b[1]=="com.sap.vocabularies.Common.v1.Label"){c[b[0]].label=a[s];}}else if(b.length==1){c[b[0]]={name:b[0],propertyPath:b[0],label:"Custom Aggregate ("+A+")",sortable:true,sortOrder:"both",custom:true};}}}return c;};u.getAllAggregatableProperties=function(a){var A={},p,P;if(a["@com.sap.vocabularies.Analytics.v1.AggregatedProperties"]){p=a["@com.sap.vocabularies.Analytics.v1.AggregatedProperties"];for(var i=0;i<p.length;i++){P=p[i];A[P.Value]={name:P.Value,propertyPath:P.AggregatableProperty.$PropertyPath,aggregationMethod:P.AggregationMethod,label:P["@com.sap.vocabularies.Common.v1.Label"]||"Aggregatable property ("+P.Value+")",sortable:true,sortOrder:"both",custom:false};}}return A;};u.getAllDataPoints=function(a){var d={};for(var A in a){if(A.startsWith("@com.sap.vocabularies.UI.v1.DataPoint")){var q=A.replace("@com.sap.vocabularies.UI.v1.DataPoint#","");var v=a[A].Value.$Path;d[v]=d[v]||{};d[v][q]=u.createDataPointProperty(a[A]);}}return d;};u.createDataPointProperty=function(d){var D={};if(d.TargetValue){D.targetValue=d.TargetValue.$Path;}if(d.ForeCastValue){D.foreCastValue=d.ForeCastValue.$Path;}var c=null;if(d.Criticality){if(d.Criticality.$Path){c={Calculated:d.Criticality.$Path};}else{c={Static:d.Criticality.$EnumMember.replace("com.sap.vocabularies.UI.v1.CriticalityType/","")};}}else if(d.CriticalityCalculation){var t={};var C=u._buildThresholds(t,d.CriticalityCalculation);if(C){c={ConstantThresholds:t};}else{c={DynamicThresholds:t};}}if(c){D.criticality=c;}return D;};u._buildThresholds=function(t,c){var k=["AcceptanceRangeLowValue","AcceptanceRangeHighValue","ToleranceRangeLowValue","ToleranceRangeHighValue","DeviationRangeLowValue","DeviationRangeHighValue"];var C=true,K;t.ImprovementDirection=c.ImprovementDirection.$EnumMember.replace("com.sap.vocabularies.UI.v1.ImprovementDirectionType/","");var d={oneSupplied:false,usedMeasures:[]};var o={oneSupplied:false};for(var i=0;i<k.length;i++){K=k[i];d[K]=c[K]?c[K].$Path:undefined;d.oneSupplied=d.oneSupplied||d[K];if(!d.oneSupplied){o[K]=c[K];o.oneSupplied=o.oneSupplied||o[K];}else if(d[K]){d.usedMeasures.push((d[K]));}}if(d.oneSupplied){C=false;for(var i=0;i<k.length;i++){if(d[k[i]]){t[k[i]]=d[k[i]];}}t.usedMeasures=d.usedMeasures;}else{var a;t.AggregationLevels=[];if(o.oneSupplied){a={VisibleDimensions:null};for(var i=0;i<k.length;i++){if(o[k[i]]){a[k[i]]=o[k[i]];}}t.AggregationLevels.push(a);}if(c.ConstantThresholds&&c.ConstantThresholds.length>0){for(var i=0;i<c.ConstantThresholds.length;i++){var A=c.ConstantThresholds[i];var v=A.AggregationLevel?[]:null;if(A.AggregationLevel&&A.AggregationLevel.length>0){for(var j=0;j<A.AggregationLevel.length;j++){v.push(A.AggregationLevel[j].$PropertyPath);}}a={VisibleDimensions:v};for(var j=0;j<k.length;j++){var n=A[k[j]];if(n){a[k[j]]=n;}}t.AggregationLevels.push(a);}}}return C;};u.getSortRestrictionsInfo=function(s){var i,p,S={sortable:true,propertyInfo:{}};if(s){S.sortable=(s.Sortable!=null)?s.Sortable:true;if(s.NonSortableProperties){for(i=0;i<s.NonSortableProperties.length;i++){p=s.NonSortableProperties[i].$PropertyPath;S[p]={sortable:false};}}if(s.AscendingOnlyProperties){for(i=0;i<s.AscendingOnlyProperties;i++){p=s.AscendingOnlyProperties[i].$PropertyPath;S[p]={sortable:true,sortDirection:"asc"};}}if(s.AscendingOnlyProperties){for(i=0;i<s.DescendingOnlyProperties;i++){p=s.DescendingOnlyProperties[i].$PropertyPath;S[p]={sortable:true,sortDirection:"desc"};}}}return S;};u.addSortInfoForProperty=function(p,s){var P=s[p.name];p.sortable=s.sortable&&P?P.sortable:true;if(p.sortable){p.sortDirection=P?P.sortDirection:"both";}};u.getFilterRestrictionsInfo=function(f){var i,p,F={filterable:true,propertyInfo:{}};if(f){F.filterable=(f.Filterable!=null)?f.Filterable:true;F.requiresFilter=(f.RequiresFilter!=null)?f.RequiresFilter:false;F.requiredProperties=[];if(F.RequiredProperties){for(i=0;i<f.NonFilterableProperties;i++){p=f.NonFilterableProperties[i].$PropertyPath;F.requiredProperties.push(p);}}if(f.NonFilterableProperties){for(i=0;i<f.NonFilterableProperties.length;i++){p=f.NonFilterableProperties[i].$PropertyPath;F[p]={filterable:false};}}if(f.FilterExpressionRestrictions){for(i=0;i<f.FilterExpressionRestrictions;i++){p=f.FilterExpressionRestrictions[i].$PropertyPath;F[p]={filterable:true,allowedExpressions:f.FilterExpressionRestrictions[i].AllowedExpressions};}}}return F;};u.isMultiValueFilterExpression=function(f){var i=true;switch(f){case"SearchExpression":case"SingleRange":case"SingleValue":i=false;break;default:break;}return i;};u.addFilterInfoForProperty=function(p,f){var P=f[p.name];p.filterable=f.filterable&&P?P.filterable:true;if(p.filterable){p.allowedExpressions=P?P.allowedExpressions:null;}};u.fetchCalendarTag=function(m,c){var C="@com.sap.vocabularies.Common.v1.";return Promise.all([m.requestObject(C+"IsCalendarYear",c),m.requestObject(C+"IsCalendarHalfyear",c),m.requestObject(C+"IsCalendarQuarter",c),m.requestObject(C+"IsCalendarMonth",c),m.requestObject(C+"IsCalendarWeek",c),m.requestObject(C+"IsDayOfCalendarMonth",c),m.requestObject(C+"IsDayOfCalendarYear",c),m.requestObject(C+"IsCalendarYearHalfyear",c),m.requestObject(C+"IsCalendarYearQuarter",c),m.requestObject(C+"IsCalendarYearMonth",c),m.requestObject(C+"IsCalendarYearWeek",c),m.requestObject(C+"IsCalendarDate",c)]).then(function(t){if(t[0]){return"year";}if(t[1]){return"halfYear";}if(t[2]){return"quarter";}if(t[3]){return"month";}if(t[4]){return"week";}if(t[5]){return"dayOfMonth";}if(t[6]){return"dayOfYear";}if(t[7]){return"yearHalfYear";}if(t[8]){return"yearQuarter";}if(t[9]){return"yearMonth";}if(t[10]){return"yearWeek";}if(t[11]){return"date";}return undefined;});};u.fetchFiscalTag=function(m,c){var C="@com.sap.vocabularies.Common.v1.";return Promise.all([m.requestObject(C+"IsFiscalYear",c),m.requestObject(C+"IsFiscalPeriod",c),m.requestObject(C+"IsFiscalYearPeriod",c),m.requestObject(C+"IsFiscalQuarter",c),m.requestObject(C+"IsFiscalYearQuarter",c),m.requestObject(C+"IsFiscalWeek",c),m.requestObject(C+"IsFiscalYearWeek",c),m.requestObject(C+"IsDayOfFiscalYear",c),m.requestObject(C+"IsFiscalYearVariant",c)]).then(function(t){if(t[0]){return"year";}if(t[1]){return"period";}if(t[2]){return"yearPeriod";}if(t[3]){return"quarter";}if(t[4]){return"yearQuarter";}if(t[5]){return"week";}if(t[6]){return"yearWeek";}if(t[7]){return"dayOfYear";}if(t[8]){return"yearVariant";}return undefined;});};u.fetchCriticality=function(m,c){var U="@com.sap.vocabularies.UI.v1";return m.requestObject(U+".ValueCriticality",c).then(function(v){var C,V;if(v){C={VeryPositive:[],Positive:[],Critical:[],VeryNegative:[],Negative:[],Neutral:[]};for(var i=0;i<v.length;i++){V=v[i];if(V.Criticality.$EnumMember.endsWith("VeryPositive")){C.VeryPositive.push(V.Value);}else if(V.Criticality.$EnumMember.endsWith("Positive")){C.Positive.push(V.Value);}else if(V.Criticality.$EnumMember.endsWith("Critical")){C.Critical.push(V.Value);}else if(V.Criticality.$EnumMember.endsWith("VeryNegative")){C.VeryNegative.push(V.Value);}else if(V.Criticality.$EnumMember.endsWith("Negative")){C.Negative.push(V.Value);}else{C.Neutral.push(V.Value);}}for(var k in C){if(C[k].length==0){delete C[k];}}}return C;});};return u;});