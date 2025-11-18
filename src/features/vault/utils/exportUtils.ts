import { VaultResource } from '../../../types';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

export const exportToJSON = (resources: VaultResource[]) => {
  const exportData = resources.map(resource => ({
    title: resource.title,
    url: resource.url,
    description: resource.description,
    category: resource.category,
    tags: resource.tags.join(', '),
    isPublic: resource.isPublic,
    isFavorite: resource.isFavorite,
    createdAt: (resource.createdAt instanceof Date ? resource.createdAt : resource.createdAt.toDate()).toISOString()
  }));

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  downloadFile(blob, `JobTrac-vault-resources-${getDateString()}.json`);
  toast.success('Resources exported as JSON!');
};

export const exportToCSV = (resources: VaultResource[]) => {
  const headers = ['Title', 'URL', 'Description', 'Category', 'Tags', 'Public', 'Favorite', 'Created'];
  const rows = resources.map(resource => [
    `"${resource.title.replace(/"/g, '""')}"`,
    `"${resource.url}"`,
    `"${resource.description.replace(/"/g, '""')}"`,
    resource.category,
    `"${resource.tags.join(', ')}"`,
    resource.isPublic ? 'Yes' : 'No',
    resource.isFavorite ? 'Yes' : 'No',
    (resource.createdAt instanceof Date ? resource.createdAt : resource.createdAt.toDate()).toLocaleDateString()
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(blob, `JobTrac-vault-resources-${getDateString()}.csv`);
  toast.success('Resources exported as CSV!');
};

export const exportToMarkdown = (resources: VaultResource[]) => {
  let markdown = '# My Resource Vault - JobTrac\n\n';
  markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;

  // Group by category
  const categories = [...new Set(resources.map(r => r.category))];
  
  categories.forEach(category => {
    const categoryResources = resources.filter(r => r.category === category);
    markdown += `## ${category}\n\n`;
    
    categoryResources.forEach(resource => {
      markdown += `### [${resource.title}](${resource.url})\n\n`;
      if (resource.description) {
        markdown += `${resource.description}\n\n`;
      }
      if (resource.tags.length > 0) {
        markdown += `**Tags:** ${resource.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`;
      }
      markdown += `**Status:** ${resource.isPublic ? 'Public' : 'Private'}${resource.isFavorite ? ' • Favorite' : ''}\n\n`;
      markdown += `**Added:** ${(resource.createdAt instanceof Date ? resource.createdAt : resource.createdAt.toDate()).toLocaleDateString()}\n\n`;
      markdown += '---\n\n';
    });
  });

  const blob = new Blob([markdown], { type: 'text/markdown' });
  downloadFile(blob, `JobTrac-vault-resources-${getDateString()}.md`);
  toast.success('Resources exported as Markdown!');
};

export const exportToPDF = async (resources: VaultResource[]) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('My Resource Vault - JobTrac', margin, yPosition);
    yPosition += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Group by category
    const categories = [...new Set(resources.map(r => r.category))];
    
    categories.forEach(category => {
      const categoryResources = resources.filter(r => r.category === category);
      
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }

      // Category header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(category, margin, yPosition);
      yPosition += 10;

      categoryResources.forEach(resource => {
        // Check if we need a new page
        if (yPosition > 260) {
          pdf.addPage();
          yPosition = margin;
        }

        // Resource title
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        const titleLines = pdf.splitTextToSize(resource.title, pageWidth - 2 * margin);
        pdf.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 6;

        // URL
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 255);
        const urlLines = pdf.splitTextToSize(resource.url, pageWidth - 2 * margin);
        pdf.text(urlLines, margin, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += urlLines.length * 5;

        // Description
        if (resource.description) {
          pdf.setFontSize(10);
          const descLines = pdf.splitTextToSize(resource.description, pageWidth - 2 * margin);
          pdf.text(descLines, margin, yPosition);
          yPosition += descLines.length * 5;
        }

        // Tags and status
        if (resource.tags.length > 0) {
          pdf.setFontSize(9);
          pdf.text(`Tags: ${resource.tags.join(', ')}`, margin, yPosition);
          yPosition += 5;
        }

        pdf.setFontSize(9);
        const status = `${resource.isPublic ? 'Public' : 'Private'}${resource.isFavorite ? ' • Favorite' : ''} • Added: ${(resource.createdAt instanceof Date ? resource.createdAt : resource.createdAt.toDate()).toLocaleDateString()}`;
        pdf.text(status, margin, yPosition);
        yPosition += 15;
      });

      yPosition += 5;
    });

    pdf.save(`JobTrac-vault-resources-${getDateString()}.pdf`);
    toast.success('Resources exported as PDF!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF');
  }
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const getDateString = () => {
  return new Date().toISOString().split('T')[0];
};