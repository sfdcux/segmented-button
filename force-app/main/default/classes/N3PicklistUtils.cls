public with sharing class N3PicklistUtils {


    @AuraEnabled
    public static List<PicklistOptions> getPicklistValuesForRecord(Id recordId, String fieldName){

        // FieldName is expected with SObjectName.FieldName Format -> Remove SObjectName
        if(fieldName.contains('.')) fieldName = fieldName.substringAfter('.');

        String sobjectName = recordId.getSObjectType().getDescribe().getName();
        Schema.SObjectType sobjectType = Schema.getGlobalDescribe().get(sobjectName);

        List<PicklistOptions> theOptions = new List<PicklistOptions>();
        SObject theRecord;

        List<SObject> sobjList = Database.query('SELECT Id, '+fieldName+' FROM '+sobjectType+' WHERE ID =: recordId');
        
        if(sobjList == null || sobjList.isEmpty()) return theOptions; 
        
        theRecord = sobjList[0];

        Schema.sObjectType sobject_type = theRecord.getSObjectType();
        Schema.DescribeSObjectResult sobject_describe = sobject_type.getDescribe(); 
        Map<String, Schema.SObjectField> field_map = sobject_describe.fields.getMap(); 
        List<Schema.PicklistEntry> pick_list_values = field_map.get(fieldName).getDescribe().getPickListValues(); 

        if(pick_list_values == null || pick_list_values.isEmpty()) return theOptions;

        for (Schema.PicklistEntry a : pick_list_values) { 
            Boolean itemSelected = a.value == theRecord.get(fieldName) ? true : false;
            theOptions.add(new PicklistOptions(a.value, a.label, itemSelected));
        } 

        return theOptions;
    }

    public class PicklistOptions {
        @auraEnabled public String value;
        @auraEnabled public String label;
        @auraEnabled public Boolean selected; 

        public PicklistOptions(String v, String l, Boolean s)
        {
            this.value = v;
            this.label = l;
            this.selected = s;
        }
    }
}
