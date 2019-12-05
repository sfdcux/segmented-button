# Salesforce Segmented Button Lightning Component

This repository includes a lightning component to create a Segmented Button in Salesforce.

## Included in this repository:

- force-app/main/default/classes/N3PicklistUtils.cls
- force-app/main/default/lwc/uxSegmentedButton

## Configuration In Salesforce

The lightning component includes two attributes in the Design of the component. 

- recordId (Optional) - This is automatically set when the lightning component is placed in a Lightning Record Page and therefore not required in those scenarios. 
- picklistField (Required) - The name of the Picklist Field to be displayed in the Segmented Button with the format of <ObjectName>.<FieldName>. For example, Account.Industry or Project__c.Type__c
    
    
