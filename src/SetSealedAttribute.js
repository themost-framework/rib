class SetSealedAttribute {
  constructor() {
    //
  }

  /**
   * 
   * @param {import('@themost/common').DataModelProperties} schema 
   * @returns void
   */
  async parse(schema) {
    schema.sealed = true;
  }
}

export {
    SetSealedAttribute
}