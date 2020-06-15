  
declare module 'rc-form' {

import { Component, ClassicComponentClass, ClassType, ComponentClass, ComponentType, ComponentSpec, Mixin, ReactNode, ClassicComponent, ComponentState } from "react";
import PropTypes, { Requireable, InferProps } from "prop-types";

export interface ValidateMessages {
  'default'?: string;
  required?: string;
  'enum'?: string;
  whitespace?: string;
  date?: {
    format?: string;
    parse?: string;
    invalid?: string;
  };
  types?: {
    string?: string;
    method?: string;
    array?: string;
    object?: string;
    number?: string;
    date?: string;
    boolean?: string;
    integer?: string;
    float?: string;
    regexp?: string;
    email?: string;
    url?: string;
    hex?: string;
  };
  string?: {
    len?: string;
    min?: string;
    max?: string;
    range?: string;
  };
  number?: {
    len?: string;
    min?: string;
    max?: string;
    range?: string;
  };
  array?: {
    len?: string;
    min?: string;
    max?: string;
    range?: string;
  };
  pattern?: {
    mismatch?: string;
  };
  clone?: () => ValidateMessages;
}
export class Field { [s: string]: any }

export type FormTrigger = 'onChange' | 'onBlur' | 'onMouseOver' | 'onMouseMove' | 'onMouseOut' |
  'onEnter' | 'onLeave';
export type FormValidateType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' |
  'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';
export interface FormValidateRule {
  type?: FormValidateType;
  required?: boolean;
  message?: any;
  pattern?: RegExp;
  range?: { min?: number; max?: number };
  len?: number;
  role?: { type: "enum", enum: any[] };
  fields?: {
    [fieldName: string]: FormValidateRule;
    [fieldIndex: number]: FormValidateRule;
  };
  defaultField?: FormValidateRule;
  transform?: (value: any) => any;
  asyncValidator?(rule: FormValidateRule, value: any): Promise<any>;
  asyncValidator?(rule: FormValidateRule, value: any, callback: (error?: any) => void): void;
  validator?(
    rule: FormValidateRule,
    value: any,
    callback?: (error?: Error) => void,
    source?: ValidateValues,
    options?: ValidateFieldsOptions
  ): boolean | Error | Error[];
  [ruleName: string]: any;
}

export interface GetFieldPropsOptions {
  valuePropName?: string;
  getValueProps?(value: any): any;
  getValueFromEvent?(e: any): any;
  initialValue?: any;
  normalize?(value: any, prev: any, all: any): any;
  trigger?: FormTrigger;
  validateTrigger?: FormTrigger;
  rules?: FormValidateRule | FormValidateRule[];
  validateFirst?: boolean;
  validate?: { trigger?: FormTrigger; rules?: FormValidateRule | FormValidateRule[] };
  hidden?: boolean;
  preserve?: boolean;
}

export type ValidateErrors = {
  [fieldName: string]: {
    errors: Array<{ message: string; field: string; [s: string]: any }>
  }
} | null;
export type ValidateValues = {
  [fieldName: string]: any
};
export type ValidateFieldsOptions = {
  suppressWarning?: boolean;
  first: boolean;
  firstFields?: boolean | string[];
  force?: boolean;
  messages?: ValidateMessages;
  [s: string]: any;
};

export interface WrappedFormMethods {
  getFieldProps(name: string, options: GetFieldPropsOptions): any;
  getFieldDecorator(name: string, option: any): (node: ReactNode) => ReactNode;
  getFieldsValue(fieldName?: string[]): any;
  getFieldValue(fieldName: string): any;
  getFieldInstance(fieldName: string): any;
  setFieldsValue(changedValues: any, callback: (...args: any[]) => any): void;
  setFields(maybeNestedFields: any, callback: (...args: any[]) => any): void;
  setFieldsInitialValue(initialValues: any): void;

  validateFields(fieldNames: string[], options: ValidateFieldsOptions, callback: (errors: ValidateErrors, values: any[]) => void): Promise<any>;
  validateFields(fieldNames: string[], options: ValidateFieldsOptions): Promise<any>;
  validateFields(options: ValidateFieldsOptions, callback: (errors: ValidateErrors, values: any[]) => void): Promise<any>;
  validateFields(fieldNames: string[], callback: (errors: ValidateErrors, values: any[]) => void): Promise<any>;
  validateFields(callback: (errors: ValidateErrors, values: any[]) => void): Promise<any>;

  getFieldsError(names?: string[]): any;
  getFieldError(name: string): any;
  isFieldValidating(name: string): boolean;
  isFieldsValidating(names?: string[]): boolean;
  isFieldTouched(name: string): boolean;
  isFieldsTouched(names?: string[]): boolean;
  isSubmitting(): boolean; // Deprecated
  submit(callback: (setSubmitting: () => void) => void): void // Deprecated
  resetFields(names?: string[]): void;
}

type Shaped<P> = {
  [K in keyof P]: PropTypes.Requireable<(...args: any[]) => any>;
}

export interface FormMixin<P, S> extends Array<Mixin<P, S>> {
  getForm(): WrappedFormMethods;
}

export type WrappedFormClass<P> = ComponentClass<P> & WrappedFormMethods;

export type Decorate<P> = (WrappedComponent: ComponentType<P>) => WrappedFormClass<P>;


export type FormPropsType<F> = { [K in keyof F]: WrappedFormMethods; };
export type PropsWithForm<P, F> = P & FormPropsType<F>;

export interface CreateFormOptions<P> {
  validateMessages?: ValidateMessages;
  onFieldsChange?: (props: P, changed: any, all: any) => void;
  onValuesChange?: (props: P, changed: any, all: any) => void;
  mapProps?: (props: P) => P;
  mapPropsToFields?: (props: P) => void;
  fieldNameProp?: string;
  fieldMetaProp?: string;
  fieldDataProp?: string;
  formPropName?: string;
  name?: string;
  withRef?: boolean; // deprecated
}

export function createForm<P>(options?: CreateFormOptions<P>): Decorate<P>;
export function createFormField(field: any): Field;
export const formShape: Requireable<InferProps<Shaped<WrappedFormMethods>>>;
}