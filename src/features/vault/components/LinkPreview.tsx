import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  title: string;
  className?: string;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  favicon?: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, title, className = '' }) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Extract domain for favicon
        const domain = new URL(url).hostname;
        
        // For common domains, we can provide custom previews
        const customPreviews: Record<string, PreviewData> = {
          'drive.google.com': {
            title: 'Google Drive',
            description: 'File stored on Google Drive',
            domain: 'Google Drive',
            favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
          },
          'docs.google.com': {
            title: 'Google Docs',
            description: 'Document on Google Docs',
            domain: 'Google Docs',
            favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
          },
          'github.com': {
            title: 'GitHub Repository',
            description: 'Code repository on GitHub',
            domain: 'GitHub',
            favicon: 'https://github.com/favicon.ico'
          },
          'linkedin.com': {
            title: 'LinkedIn Profile',
            description: 'Professional profile on LinkedIn',
            domain: 'LinkedIn',
            favicon: 'https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca'
          },
          'dropbox.com': {
            title: 'Dropbox',
            description: 'File stored on Dropbox',
            domain: 'Dropbox',
            favicon: 'https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico'
          },
          'onedrive.live.com': {
            title: 'OneDrive',
            description: 'File stored on OneDrive',
            domain: 'OneDrive',
            favicon: 'https://res.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/onedrive_16x1.svg'
          }
        };

        // Check if we have a custom preview for this domain
        const customPreview = Object.keys(customPreviews).find(key => domain.includes(key));
        if (customPreview) {
          setPreview(customPreviews[customPreview]);
          setLoading(false);
          return;
        }

        // For other domains, create a basic preview
        setPreview({
          title: title || 'External Resource',
          description: `Resource hosted on ${domain}`,
          domain: domain,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
        });
        
      } catch (err) {
        console.error('Error fetching preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url, title]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg h-20 ${className}`}>
        <div className="flex items-center p-3 h-full">
          <div className="w-12 h-12 bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border rounded-lg flex-shrink-0"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className={`bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg p-3 ${className}`}>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text">
              {title || 'External Resource'}
            </p>
            <p className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              Preview not available
            </p>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg p-3 hover:border-slate-300 dark:hover:border-dark-text-secondary amoled:hover:border-amoled-text-secondary transition-colors cursor-pointer ${className}`}
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
          {preview.favicon ? (
            <img 
              src={preview.favicon} 
              alt={preview.domain}
              className="w-6 h-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <ImageIcon className="w-6 h-6 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hidden" />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text truncate">
            {preview.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary truncate">
            {preview.description}
          </p>
          <p className="text-xs text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mt-1">
            {preview.domain}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary flex-shrink-0" />
      </div>
    </motion.div>
  );
};

export default LinkPreview;