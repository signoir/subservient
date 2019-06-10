/*
 * Copyright(c) 2019. All rights reserved.
 * Last modified 3/6/19 12:11 PM
 */

export interface Backend {
  endpoint: string;
  params: Array<{
    key: string;
    value: string;
  }>;
}
