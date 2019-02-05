import { Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver } from '@angular/core';

import { Sample1Component } from '../sample1/sample1.component';
import { EmployeeComponent } from '../employee/employee.component';
import { HeaderComponentComponent } from '../header-component/header-component.component'
import { LogoComponent } from '../logo/logo.component';
import { ObjectiveComponent } from '../objective/objective.component';
import { RiskReturnsComponent } from '../risk-returns/risk-returns.component';
import {RiskAllocationComponent} from '../risk-allocation/risk-allocation.component';
import {DisclaimerComponent} from '../disclaimer/disclaimer.component';
declare var $: any;
@Component({
  selector: 'dynamic-component',
  entryComponents: [Sample1Component,
    EmployeeComponent,
    HeaderComponentComponent,
    LogoComponent,
    ObjectiveComponent,
    RiskReturnsComponent,
    RiskAllocationComponent,
    DisclaimerComponent], // Reference to the components must be here in order to dynamically create them
  template: `
    <div [id] = "componentID"  #dynamicComponentContainer></div>
  `,
})
export default class DynamicComponent {
  componentClass: string = "";
  componentID: string = "";
  currentComponent = null;
  constructor(private resolver: ComponentFactoryResolver) {

  }
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  @Input() set componentData(data: { component: any, inputs: any }) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(data.inputs).map((inputName) => { return { provide: inputName, useValue: data.inputs[inputName] }; });
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

    // We create a factory out of the component we want to create
    let factory = this.resolver.resolveComponentFactory(data.component);

    // We create the component using the factory and the injector
    let component = factory.create(injector);

    // We insert the component into the dom container
    this.dynamicComponentContainer.insert(component.hostView);
    this.componentID = "Component" + data["row"].toString() + data["col"].toString();

    // We can destroy the old component is we like by calling destroy
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
    if (data["id"] == "Component1" || data["id"] == "Component2" || data["id"] == "RiskAllocationComponent") {
      this.currentComponent._component.elementId = this.componentID;
    }
  }

}
