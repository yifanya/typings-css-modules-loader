declare namespace IndexMCssModule {
  export interface IIndexMCss {
    'mTest': string;
  }
}

declare const IndexMCssModule: IndexMCssModule.IIndexMCss & {
  locals: IndexMCssModule.IIndexMCss;
};

export = IndexMCssModule;