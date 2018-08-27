import { combineReducers } from 'redux';
import { groupsIsLoading, groupsHasErrored, groups } from './groups';
import { selectedTab } from './app';
import { hostsHasErrored, hostsIsLoading, hosts } from './hosts';
import { profilesHasErrored, profilesIsLoading, profiles } from './profiles';
import { servicesHasErrored, servicesIsLoading, services } from './services';
import { zonesHasErrored, zonesIsLoading, zones } from './zones';
import {
  groupHasErrored,
  groupIsLoading,
  group,
  editGroupOpen,
  createGroupHasErrored,
  createGroupIsLoading,
} from './group';

export default combineReducers({
  groupsHasErrored,
  groupsIsLoading,
  groups,
  groupHasErrored,
  groupIsLoading,
  group,
  editGroupOpen,
  createGroupHasErrored,
  createGroupIsLoading,
  hostsHasErrored,
  hostsIsLoading,
  hosts,
  profilesHasErrored,
  profilesIsLoading,
  profiles,
  selectedTab,
  servicesHasErrored,
  servicesIsLoading,
  services,
  zonesHasErrored,
  zonesIsLoading,
  zones,
});
