using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Microsoft.Crm;
using Microsoft.Xrm.Tooling.Connector;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace Test.ConsoleApp
{
    class Program
    {
        private static void AddCommunication(Entity entity, IOrganizationService service, bool type, bool main)
        {
            Entity communicationToCreate = new Entity("nav_communication");
            communicationToCreate["nav_name"] = (type?"email: ":"phone: ") + entity.GetAttributeValue<string>("fullname");
            communicationToCreate[type ? "nav_email" : "nav_phone"] = entity.GetAttributeValue<string>(type ? "emailaddress1":"telephone1");
            communicationToCreate["nav_contactid"] = new EntityReference(entity.LogicalName, entity.Id);
            communicationToCreate["nav_type"] = type;
            communicationToCreate["nav_main"] = main;
            service.Create(communicationToCreate);

        }
        static void Main(string[] args)
        {
            

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var connectingString = "AuthType=OAuth; Url=https://trialtest.crm4.dynamics.com/; Username=admin@november1414.onmicrosoft.com; Password=Kik12345; RequireNewInstance=true; AppId=51f81489-12ee-4a9e-aaae-a2591f45987d; RedirectUri=app://58145B91-0C36-4500-8554-080854F2AC97;LoginPrompt=Auto; ";
            CrmServiceClient client = new CrmServiceClient(connectingString);
            if(client.LastCrmException!=null)
            {
                Console.WriteLine(client.LastCrmException);
            }

            var service = (IOrganizationService)client;
            //Обновляем контакты данными из "Средств связи"
            QueryExpression queryContact = new QueryExpression("nav_communication");
            queryContact.ColumnSet = new ColumnSet("nav_phone", "nav_email", "nav_contactid", "nav_type", "nav_main", "nav_name");
            queryContact.NoLock=true;
            queryContact.TopCount = 20;
            queryContact.Criteria.AddCondition("nav_main", ConditionOperator.Equal, true);

            var linkContact = queryContact.AddLink("contact", "nav_contactid", "contactid");
            linkContact.EntityAlias = "c";
            linkContact.Columns = new ColumnSet("fullname", "telephone1", "emailaddress1", "contactid");
            var resultContact = service.RetrieveMultiple(queryContact);
            foreach(var entity in resultContact.Entities)
            {
                Entity contactToUpdate = new Entity("contact", "contactid", entity.GetAttributeValue<AliasedValue>("c.contactid").Value);
                if (entity.GetAttributeValue<bool>("nav_type"))
                {
                    if (entity.GetAttributeValue<AliasedValue>("c.emailaddress1") == null || entity.GetAttributeValue<AliasedValue>("c.emailaddress1").Value == null || (string)entity.GetAttributeValue<AliasedValue>("c.emailaddress1").Value == "")
                    {
                        contactToUpdate["emailaddress1"] = entity.GetAttributeValue<string>("nav_email");
                        Console.WriteLine("mail");
                        service.Update(contactToUpdate);
                    }
                }
                else
                {
                    if (entity.GetAttributeValue<AliasedValue>("c.telephone1") == null  || entity.GetAttributeValue<AliasedValue>("c.telephone1").Value == null || (string)entity.GetAttributeValue<AliasedValue>("c.telephone1").Value == "")
                    {
                        contactToUpdate["telephone1"] = entity.GetAttributeValue<string>("nav_phone");
                        Console.WriteLine("phone");
                        service.Update(contactToUpdate);
                    }
                }              
            }

            //Создаём "средства связи" по данным из контакта
            QueryExpression queryCommunication = new QueryExpression("contact");
            queryCommunication.ColumnSet = new ColumnSet("fullname", "telephone1", "emailaddress1", "contactid");
            queryCommunication.NoLock = true;

            var linkCommunication = queryCommunication.AddLink("nav_communication", "contactid", "nav_contactid", JoinOperator.LeftOuter);
            linkCommunication.EntityAlias = "c";
            linkCommunication.Columns = new ColumnSet("nav_contactid", "nav_phone", "nav_email", "nav_communicationid");
            var resultCommunication = service.RetrieveMultiple(queryCommunication);
            foreach (var entity in resultCommunication.Entities)
            {
                if(entity.GetAttributeValue<AliasedValue>("c.nav_contactid") == null)
                {
                    if(entity.GetAttributeValue<string>("telephone1") != null)
                    {
                        AddCommunication(entity, service, false, true);

                        if (entity.GetAttributeValue<string>("emailaddress1") != null)
                        {
                            AddCommunication(entity, service, true, false);
                        }
                    }
                    else if (entity.GetAttributeValue<string>("emailaddress1") != null)
                    {
                        AddCommunication(entity, service, true, true);
                    }
                }                
            }



            Console.Read();
        }
    }
}
