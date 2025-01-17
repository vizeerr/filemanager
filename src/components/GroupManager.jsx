import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tab, Tabs, TabList, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';
import { FileCard } from './FileCard';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BottomSheet } from '@/components/ui/bottom-sheet';

export function GroupManager({ files, onFileAction }) {
  const [activeTab, setActiveTab] = useState(0); // 0: Ungrouped, 1: Groups
  const [isGroupMode, setGroupMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  // Handle file selection for grouping
  const handleFileSelect = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  // Save the group and reset state
  const saveGroup = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to create a group.');
      return;
    }

    const newGroup = {
      name: groupName.trim() || `Group ${groups.length + 1}`,
      files: selectedFiles,
    };

    setGroups([...groups, newGroup]);
    setSelectedFiles([]);
    setGroupMode(false);
    setGroupName('');
  };

  // Open the bottom sheet to view group details
  const openGroup = (group) => {
    setCurrentGroup(group);
    setBottomSheetOpen(true);
  };

  // Separate ungrouped files
  const ungroupedFiles = files.filter((file) => !groups.some((group) => group.files.includes(file)));

  return (
    <div>
      {/* Tab Navigation */}
      <Tabs onChange={(index) => setActiveTab(index)}>
        <TabList>
          <Tab>Ungrouped</Tab>
          <Tab>Groups</Tab>
        </TabList>

        {/* Ungrouped Files Tab */}
        <TabPanel>
          <div>
            {isGroupMode ? (
              <div className="mb-4 flex items-center space-x-2">
                <Input
                  placeholder="Group name (optional)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button onClick={saveGroup}>Save Group</Button>
                <Button variant="secondary" onClick={() => setGroupMode(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setGroupMode(true)}>Make Group</Button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {ungroupedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`${
                    isGroupMode && selectedFiles.includes(file) ? 'border border-blue-500' : ''
                  }`}
                  onClick={() => isGroupMode && handleFileSelect(file)}
                >
                  <FileCard
                    file={file}
                    onDelete={onFileAction.onDelete}
                    onRename={onFileAction.onRename}
                    onSetPassword={onFileAction.onSetPassword}
                    onVerifyPassword={onFileAction.onVerifyPassword}
                    onRemovePassword={onFileAction.onRemovePassword}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        {/* Groups Tab */}
        <TabPanel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg shadow">
                <h2 className="font-bold">{group.name}</h2>
                <p>{group.files.length} files</p>
                <Button className="mt-2" onClick={() => openGroup(group)}>
                  View Group
                </Button>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>

      {/* Bottom Sheet to View Group Files */}
      <BottomSheet isOpen={isBottomSheetOpen} onDismiss={() => setBottomSheetOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentGroup?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentGroup?.files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={onFileAction.onDelete}
                onRename={onFileAction.onRename}
                onSetPassword={onFileAction.onSetPassword}
                onVerifyPassword={onFileAction.onVerifyPassword}
                onRemovePassword={onFileAction.onRemovePassword}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setBottomSheetOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </BottomSheet>
    </div>
  );
}
