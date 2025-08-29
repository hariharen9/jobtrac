import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useFirestore } from './useFirestore';

export function useDataImportExport(userId?: string | null) {
  // Use any to bypass type constraints for import operations
  const { addItem: addApplication } = useFirestore<any>('applications', userId);
  const { addItem: addPrepEntry } = useFirestore<any>('prepEntries', userId);
  const { addItem: addStory } = useFirestore<any>('stories', userId);
  const { addItem: addCompany } = useFirestore<any>('companies', userId);
  const { addItem: addContact } = useFirestore<any>('contacts', userId);

  const importData = useCallback(async (importRequest: { type: string; data: any[] }) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const data = JSON.parse(text);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of data) {
        try {
          // Clean and validate data based on type
          let cleanedItem: any;

          switch (type) {
            case 'applications':
              cleanedItem = {
                company: item.company || '',
                role: item.role || '',
                link: item.link || '',
                date: item.date || new Date().toISOString().split('T')[0],
                status: ['applied', 'interviewing', 'offer', 'rejected'].includes(item.status?.toLowerCase()) 
                  ? item.status.toLowerCase() : 'applied',
                location: item.location || '',
                recruiter: item.recruiter || '',
                referral: ['Y', 'N'].includes(item.referral?.toUpperCase()) ? item.referral.toUpperCase() : 'N',
                nextStep: item.nextStep || '',
                notes: item.notes || '',
                jobDescription: item.jobDescription || ''
              };
              await addApplication(cleanedItem);
              break;

            case 'prepEntries':
              cleanedItem = {
                date: item.date || new Date().toISOString().split('T')[0],
                topic: item.topic || '',
                problems: item.problems || '',
                time: parseInt(item.time) || 0,
                confidence: Math.min(10, Math.max(1, parseInt(item.confidence) || 5)),
                notes: item.notes || ''
              };
              await addPrepEntry(cleanedItem);
              break;

            case 'stories':
              cleanedItem = {
                title: item.title || '',
                situation: item.situation || '',
                task: item.task || '',
                action: item.action || '',
                result: item.result || ''
              };
              await addStory(cleanedItem);
              break;

            case 'companies':
              cleanedItem = {
                company: item.company || '',
                whatTheyDo: item.whatTheyDo || '',
                values: item.values || '',
                why: item.why || '',
                questions: item.questions || '',
                news: item.news || ''
              };
              await addCompany(cleanedItem);
              break;

            case 'contacts':
              cleanedItem = {
                name: item.name || '',
                company: item.company || '',
                role: item.role || '',
                date: item.date || new Date().toISOString().split('T')[0],
                status: item.status || '',
                referral: ['Y', 'N'].includes(item.referral?.toUpperCase()) ? item.referral.toUpperCase() : 'N',
                notes: item.notes || ''
              };
              await addContact(cleanedItem);
              break;

            default:
              throw new Error(`Unknown import type: ${type}`);
          }
          
          successCount++;
        } catch (itemError) {
          console.error(`Error importing item:`, item, itemError);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} ${type}!`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} items. Please check the format.`);
      }

    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }, [userId, addApplication, addPrepEntry, addStory, addCompany, addContact]);

  const validateImportData = useCallback((type: string, data: any[]) => {
    const requiredFields: Record<string, string[]> = {
      applications: ['company', 'role'],
      prepEntries: ['date', 'topic'],
      stories: ['title', 'situation'],
      companies: ['company'],
      contacts: ['name', 'company']
    };

    const required = requiredFields[type] || [];
    const errors: string[] = [];

    data.forEach((item, index) => {
      required.forEach(field => {
        if (!item[field] || item[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });
    });

    return errors;
  }, []);

  const generateSampleCSV = useCallback((type: string) => {
    const samples: Record<string, string> = {
      applications: `company,role,link,date,status,location,recruiter,referral,nextStep,notes
Google,Software Engineer,https://careers.google.com/jobs/12345,2024-01-15,applied,Mountain View CA,Jane Smith,N,Phone screening scheduled,Great company culture
Microsoft,Product Manager,https://careers.microsoft.com/jobs/67890,2024-01-16,interviewing,Seattle WA,John Doe,Y,Technical interview next week,Interesting product team`,
      
      prepEntries: `date,topic,problems,time,confidence,notes
2024-01-15,System Design,Design a chat application,120,8,Focused on scalability and real-time messaging
2024-01-16,Algorithms,Two Sum and Three Sum problems,90,7,Need to practice more hash table problems`,
      
      stories: `title,situation,task,action,result
Led Team Through Crisis,Our main server crashed during peak hours,Restore service and prevent data loss,Coordinated with team to implement backup systems,Restored service in 30 minutes with zero data loss
Improved Code Quality,Legacy codebase had technical debt,Refactor and improve maintainability,Implemented code reviews and testing,Reduced bugs by 40% and improved deployment speed`,
      
      companies: `company,whatTheyDo,values,why,questions,news
Google,Search engine and cloud services,Innovation and user focus,Cutting-edge technology and impact,What are the biggest challenges in search today?,Recently announced new AI initiatives
Microsoft,Software and cloud computing,Empowerment and inclusion,Strong engineering culture,How is Microsoft approaching AI integration?,New GitHub Copilot features launched`,
      
      contacts: `name,company,role,date,status,referral,notes
John Doe,Google,Engineering Manager,2024-01-15,contacted,Y,Met at tech conference - very helpful
Jane Smith,Microsoft,Senior Developer,2024-01-16,pending,N,LinkedIn connection - potential mentor`
    };

    return samples[type] || '';
  }, []);

  return {
    importData,
    validateImportData,
    generateSampleCSV
  };
}