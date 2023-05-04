import { Injectable } from '@angular/core';
import { WorkEffortAnalysis } from '../model/workEffortAnalysis';
import { WorkEffortAnalysisTarget } from 'app/api/model/workEffortAnalysisTarget';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiClientService } from 'app/commons/service/client.service';
import { DetailKPI } from '../model/detailKPI';



@Injectable()
export class WorkEffortAnalysisService {

  constructor(private client: ApiClientService) { }

  getWorkEffortAnalysis(analysisId: string): Observable<WorkEffortAnalysis> {

    return this.client
      .get(`work-effort-analysis-id/${analysisId}`).pipe(
        map(json => json as WorkEffortAnalysis)
      );
  }

  /**
   * Gets the list of analyses in a context.
   * 
   * @param context - Context.
   * @returns Observable array of WorkEffortAnalysis.
   */
  getWorkEffortAnalysisWithContext(context: string): Observable<WorkEffortAnalysis[]> {
    console.log('search workEffortAnalysis list');
    return this.client
      .get(`work-effort-analysis/${context}`).pipe(
        map(json => json.results as WorkEffortAnalysis[])
      );
  }

  /**
   * Gets the header.
   * 
   * @param analysisId - Analysis Id.
   * @param workEffortId - Work Effort Id.
   * @returns Observable array of WorkEffortAnalysis.
   */
  getWorkEffortAnalysisHeader(analysisId: string, workEffortId: string): Observable<WorkEffortAnalysis[]> {
    console.log('search workEffortAnalysis Header');
    return this.client
      .get(`work-effort-analysis-targets-header/${analysisId}/${workEffortId}`).pipe(
        map(json => json.results as WorkEffortAnalysis[])
      );

  }

  /**
   * Gets the list of work effort with out a workEffortId.
   * 
   * @param context - Context.
   * @param analysisId - Analysis Id.
   * @returns Observable array.
   */
  getWorkEffortAnalysisTargetSummary(context: string, analysisId: string): Observable<any[]> {
    console.log('search workEffortAnalysis Summary');
    return this.client
      .get(`work-effort-analysis-targets/${context}/${analysisId}`).pipe(
        map(json => json.results as any[]),
      );
  }

  /**
   * Gets the header.
   * 
   * @param analysisId - Analysis Id.
   * @param workEffortId - Work Effort Id.
   * @returns Observable array.
   */
  getWorkEffortAnalysisTargetHeaderOne(analysisId: string, workEffortId: string): Observable<any[]> {

    return this.client
    .get(`work-effort-analysis-targets/header/${analysisId}/${workEffortId}`).pipe(
      map(json => json.results as any[]), 
      
    );
  }

  /**
   * Gets the list of work effort.
   * 
   * @param context - Context.
   * @param analysisId - Analysis Id.
   * @param dateControl - dateControl by comments.
   * @returns Observable array WorkEffortAnalysisTarget.
   */
  getWorkEffortAnalysisTargetList(context: string, analysisId: string, dateControl: string): Observable<WorkEffortAnalysisTarget[]> {

    return this.client
    .get(`work-effort-analysis-targets/list/${context}/${analysisId}/${dateControl}`).pipe(
      map(json => json.results as WorkEffortAnalysisTarget[]), 
    );
  }

  /**
   * Gets the list of work effort with a workEffortId.
   * 
   * @param analysisId - Analysis Id.
   * @param workEffortId - Work Effort Id.
   * @param dateControl - dateControl by comments.
   * @returns Observable array WorkEffortAnalysisTarget.
   */
  getWorkEffortAnalysisTargetListWithWE(analysisId: string, workEffortId: string, dateControl: string): Observable<WorkEffortAnalysisTarget[]> {
    return this.client
    .get(`work-effort-analysis-targets/list-with-work-effort/${analysisId}/${workEffortId}/${dateControl}`).pipe(
      map(json => json.results as WorkEffortAnalysisTarget[])
    )
  }

  /**
   * Gets the header.
   * 
   * @param context - Context.
   * @param analysisId - Analysis Id.
   * @returns Observable array WorkEffortAnalysisTarget.
   */
  getWorkEffortAnalysisTargetHeaderMore(context: string, analysisId: string): Observable<WorkEffortAnalysisTarget[]>{
    return this.client
    .get(`work-effort-analysis-targets/header-more/${context}/${analysisId}`).pipe(
      map(json => json.results as WorkEffortAnalysisTarget[])
    )
  }

  /**
   * Gets the indicators when detailKPI from comments equals SCORE.
   * 
   * @param analysisId - Analysis id.
   * @param workEffortId - Work effort id.
   * @param dateControl - dateControl by comments.
   * @returns Observable array DetailKPI
   */
  getDetailKPIScore(analysisId: string, workEffortId: string, dateControl: string): Observable<DetailKPI[]> {
    return this.client
    .get(`work-effort-analysis-targets/detailKPIScore/${analysisId}/${workEffortId}/${dateControl}`).pipe(
      map(json => json.results as DetailKPI[])
    )
  }

  /**
   * Gets the indicators when detailKPI from comments equals PERIOD.
   * 
   * @param analysisId - Analysis id.
   * @param workEffortId - Work effort id.
   * @param dateControl - dateControl by comments.
   * @returns Observable array DetailKPI
   */
  getDetailKPIPeriod(analysisId: string, workEffortId: string, dateControl: string): Observable<DetailKPI[]> {
    return this.client
    .get(`work-effort-analysis-targets/detailKPIPeriod/${analysisId}/${workEffortId}/${dateControl}`).pipe(
      map(json => json.results as DetailKPI[])
    )
  }

}
