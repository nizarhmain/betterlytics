
type Name = string;
type Type = string;

function safeSql<T extends [any, Name, Type][]>(template: TemplateStringsArray, ...params: T){
  
  /**
   * Map [expression, type] to { key: parameter, value: expression }
   */
  const boundParams = params
    .map(([value, variable, clickhouseType]) => {
      return {
        variable,
        key: `{${variable}:${clickhouseType}}`,
        value
      }
    });
  
  /**
   * Tag sql with "{previous sql}{current sql}{parameter}"
   */
  const taggedSql = template
    .reduce((acc, part, index) => `${acc}${part}${boundParams[index].key ?? ""}`);
  
  /**
   * Reduce the tagged params to:
   * {
   *   'var_0': expression[0],
   *   'var_1': expression[1],
   *   'var_2': expression[2],
   * }
   */
  const taggedParams = boundParams
    .reduce((acc, { variable, value }) => ({ ...acc, [variable]: value }), {});

  return {
    taggedSql,
    taggedParams
  }
}